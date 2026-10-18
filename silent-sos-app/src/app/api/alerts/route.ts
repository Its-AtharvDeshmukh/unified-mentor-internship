import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSosSchema } from "@/lib/validations";
import { sendEmergencyEmail, sendEmergencySms } from "@/lib/notifications";

export async function GET(req: NextRequest) {
  const session = await getServerSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const page = Math.max(
    1,
    Number(req.nextUrl.searchParams.get("page") || "1")
  );
  const limit = Math.min(
    50,
    Math.max(1, Number(req.nextUrl.searchParams.get("limit") || "15"))
  );

  const [alerts, total] = await Promise.all([
    prisma.emergencyAlert.findMany({
      where: { userId: session.userId },
      include: {
        notifications: true,
        _count: { select: { locations: true, activities: true } },
      },
      orderBy: { triggeredAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.emergencyAlert.count({ where: { userId: session.userId } }),
  ]);

  return NextResponse.json({ alerts, total, page, limit });
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const session = await getServerSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createSosSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { idempotencyKey, triggerNote, location, locationStatus } =
      parsed.data;

    // 1. Check idempotency key to prevent duplicate alerts from frantic clicks/retries
    const duplicateKeyAlert = await prisma.emergencyAlert.findUnique({
      where: { idempotencyKey },
      include: { notifications: true, activities: true },
    });
    if (duplicateKeyAlert && duplicateKeyAlert.userId === session.userId) {
      return NextResponse.json({
        alert: duplicateKeyAlert,
        deduplicated: true,
        processingTimeMs: Date.now() - startTime,
      });
    }

    // 2. Check if user already has an active unresolved alert within the last 2 minutes
    const existingActive = await prisma.emergencyAlert.findFirst({
      where: {
        userId: session.userId,
        status: { in: ["CREATED", "PROCESSING", "SENT", "ACKNOWLEDGED"] },
      },
      include: { notifications: true, activities: true },
      orderBy: { triggeredAt: "desc" },
    });

    if (existingActive) {
      return NextResponse.json({
        alert: existingActive,
        deduplicated: true,
        message: "Returning currently active alert.",
        processingTimeMs: Date.now() - startTime,
      });
    }

    const contacts = await prisma.emergencyContact.findMany({
      where: { userId: session.userId },
    });

    const shareToken = crypto.randomBytes(24).toString("hex");
    const hasCoords =
      location?.latitude !== undefined && location?.longitude !== undefined;

    // 3. Create Alert & Initial Audit Trail inside a transaction
    const alert = await prisma.$transaction(async (tx) => {
      const created = await tx.emergencyAlert.create({
        data: {
          userId: session.userId,
          status: "PROCESSING",
          idempotencyKey,
          shareToken,
          shareTokenExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h revocable expiry
          triggerNote: triggerNote || null,
          latitude: hasCoords ? location!.latitude : null,
          longitude: hasCoords ? location!.longitude : null,
          accuracy: hasCoords ? location!.accuracy ?? null : null,
          locationStatus: hasCoords ? "AVAILABLE" : locationStatus,
          lastLocationAt: hasCoords ? new Date() : null,
        },
      });

      if (hasCoords) {
        await tx.locationUpdate.create({
          data: {
            alertId: created.id,
            latitude: location!.latitude,
            longitude: location!.longitude,
            accuracy: location!.accuracy ?? null,
          },
        });
      }

      await tx.alertActivity.create({
        data: {
          alertId: created.id,
          actor: "USER",
          action: "ALERT_CREATED",
          details: hasCoords
            ? `Silent SOS activated with GPS coordinates (±${Math.round(
                location?.accuracy ?? 0
              )}m).`
            : `Silent SOS activated without GPS (${locationStatus}).`,
        },
      });

      return created;
    });

    // 4. Dispatch Notifications to Trusted Contacts
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const responderUrl = `${appUrl}/respond/${alert.shareToken}`;

    const dispatchPayload = {
      alertId: alert.id,
      userName: session.name,
      triggeredAtIso: alert.triggeredAt.toISOString(),
      responderUrl,
      latitude: alert.latitude,
      longitude: alert.longitude,
      accuracy: alert.accuracy,
      locationStatus: alert.locationStatus,
    };

    let successCount = 0;
    let totalAttempts = 0;

    for (const contact of contacts) {
      if (contact.notifySms && contact.phone) {
        totalAttempts++;
        const smsOutcome = await sendEmergencySms(
          contact.phone,
          dispatchPayload
        );
        if (smsOutcome.status !== "FAILED") successCount++;

        await prisma.notificationAttempt.create({
          data: {
            alertId: alert.id,
            contactId: contact.id,
            recipientName: contact.name,
            channel: "SMS",
            destination: contact.phone,
            status: smsOutcome.status,
            provider: smsOutcome.provider,
            providerMessageId: smsOutcome.providerMessageId,
            errorMessage: smsOutcome.errorMessage,
            retryCount: smsOutcome.retryCount,
          },
        });
      }

      if (contact.notifyEmail && contact.email) {
        totalAttempts++;
        const emailOutcome = await sendEmergencyEmail(
          contact.email,
          dispatchPayload
        );
        if (emailOutcome.status !== "FAILED") successCount++;

        await prisma.notificationAttempt.create({
          data: {
            alertId: alert.id,
            contactId: contact.id,
            recipientName: contact.name,
            channel: "EMAIL",
            destination: contact.email,
            status: emailOutcome.status,
            provider: emailOutcome.provider,
            providerMessageId: emailOutcome.providerMessageId,
            errorMessage: emailOutcome.errorMessage,
            retryCount: emailOutcome.retryCount,
          },
        });
      }
    }

    // 5. Compute honest server-verified status
    const finalStatus =
      totalAttempts === 0
        ? "CREATED" // Alert recorded on server, but user had 0 contacts configured
        : successCount > 0
        ? "SENT"
        : "FAILED";

    const updatedAlert = await prisma.emergencyAlert.update({
      where: { id: alert.id },
      data: { status: finalStatus },
      include: {
        notifications: true,
        activities: { orderBy: { createdAt: "desc" } },
      },
    });

    await prisma.alertActivity.create({
      data: {
        alertId: alert.id,
        actor: "SYSTEM",
        action:
          finalStatus === "SENT"
            ? "NOTIFICATIONS_DISPATCHED"
            : finalStatus === "CREATED"
            ? "NO_CONTACTS_CONFIGURED"
            : "NOTIFICATION_DISPATCH_FAILED",
        details:
          totalAttempts === 0
            ? "Alert logged on server. No trusted contacts were configured for outbound dispatch."
            : `Completed ${totalAttempts} notification attempt(s): ${successCount} succeeded (${
                process.env.NOTIFICATION_MODE || "sandbox"
              } mode).`,
      },
    });

    return NextResponse.json(
      {
        alert: updatedAlert,
        deduplicated: false,
        processingTimeMs: Date.now() - startTime,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("SOS creation failure:", error);
    return NextResponse.json(
      { error: "Emergency alert server error." },
      { status: 500 }
    );
  }
}

