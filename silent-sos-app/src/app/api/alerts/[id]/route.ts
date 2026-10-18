import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  alertActionSchema,
  AlertStatusType,
  canTransitionAlertStatus,
} from "@/lib/validations";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const alert = await prisma.emergencyAlert.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      notifications: { orderBy: { attemptedAt: "asc" } },
      locations: { orderBy: { recordedAt: "desc" }, take: 25 },
      activities: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!alert) {
    return NextResponse.json({ error: "Alert not found" }, { status: 404 });
  }

  // Strict authorization: Only alert owner or authorized ADMIN
  if (alert.userId !== session.userId && session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (session.role === "ADMIN" && alert.userId !== session.userId) {
    await prisma.alertActivity.create({
      data: {
        alertId: alert.id,
        actor: "ADMIN",
        action: "ADMIN_AUDIT_VIEW",
        details: `Administrator (${session.email}) inspected alert record.`,
      },
    });
  }

  return NextResponse.json({ alert });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const alert = await prisma.emergencyAlert.findUnique({
    where: { id: params.id },
  });

  if (!alert) {
    return NextResponse.json({ error: "Alert not found" }, { status: 404 });
  }

  if (alert.userId !== session.userId && session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = alertActionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const targetStatus: AlertStatusType =
    parsed.data.action === "ACKNOWLEDGE" ? "ACKNOWLEDGED" : "RESOLVED";

  if (
    !canTransitionAlertStatus(alert.status as AlertStatusType, targetStatus)
  ) {
    return NextResponse.json(
      {
        error: `Invalid lifecycle transition from ${alert.status} to ${targetStatus}.`,
      },
      { status: 400 }
    );
  }

  const now = new Date();
  const updated = await prisma.$transaction(async (tx) => {
    const record = await tx.emergencyAlert.update({
      where: { id: alert.id },
      data: {
        status: targetStatus,
        ...(targetStatus === "ACKNOWLEDGED"
          ? {
              acknowledgedAt: alert.acknowledgedAt ?? now,
              acknowledgedBy: parsed.data.actorName || session.name,
            }
          : {}),
        ...(targetStatus === "RESOLVED"
          ? {
              resolvedAt: now,
              resolutionNote:
                parsed.data.note || "Marked safe and resolved by user.",
              // Revoke public responder share token expiry on resolution
              shareTokenExpiry: now,
            }
          : {}),
      },
      include: {
        notifications: true,
        locations: { orderBy: { recordedAt: "desc" }, take: 15 },
        activities: { orderBy: { createdAt: "desc" } },
      },
    });

    await tx.alertActivity.create({
      data: {
        alertId: alert.id,
        actor: session.role === "ADMIN" ? "ADMIN" : "USER",
        action:
          targetStatus === "ACKNOWLEDGED"
            ? "ALERT_ACKNOWLEDGED"
            : "ALERT_RESOLVED",
        details:
          targetStatus === "ACKNOWLEDGED"
            ? `Alert acknowledged by ${parsed.data.actorName || session.name}.`
            : `Alert resolved safely (${
                parsed.data.note || "User confirmed safety"
              }). Live tracking stopped.`,
      },
    });

    return record;
  });

  return NextResponse.json({ alert: updated });
}

