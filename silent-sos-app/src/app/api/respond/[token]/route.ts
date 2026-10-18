import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Authorized Trusted Contact Responder Endpoint
 * Accessible via short-lived cryptographic shareToken dispatched in SMS/Email.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } }
) {
  const alert = await prisma.emergencyAlert.findUnique({
    where: { shareToken: params.token },
    include: {
      user: { select: { name: true, phone: true } },
      locations: { orderBy: { recordedAt: "desc" }, take: 10 },
      activities: { orderBy: { createdAt: "desc" }, take: 15 },
    },
  });

  if (!alert) {
    return NextResponse.json(
      { error: "Invalid or expired emergency share link." },
      { status: 404 }
    );
  }

  return NextResponse.json({ alert });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const alert = await prisma.emergencyAlert.findUnique({
    where: { shareToken: params.token },
  });

  if (!alert) {
    return NextResponse.json(
      { error: "Emergency alert link not found." },
      { status: 404 }
    );
  }

  if (alert.status === "RESOLVED") {
    return NextResponse.json(
      { error: "This emergency alert has already been resolved." },
      { status: 400 }
    );
  }

  const body = await req.json();
  const responderName =
    typeof body.responderName === "string" && body.responderName.trim().length > 1
      ? body.responderName.trim().slice(0, 80)
      : "Trusted Contact";

  const now = new Date();
  const updated = await prisma.$transaction(async (tx) => {
    const rec = await tx.emergencyAlert.update({
      where: { id: alert.id },
      data: {
        status: "ACKNOWLEDGED",
        acknowledgedAt: alert.acknowledgedAt ?? now,
        acknowledgedBy: responderName,
      },
    });

    await tx.alertActivity.create({
      data: {
        alertId: alert.id,
        actor: "CONTACT",
        action: "ALERT_ACKNOWLEDGED",
        details: `${responderName} acknowledged receipt of the emergency alert via responder link.`,
      },
    });

    return rec;
  });

  return NextResponse.json({ alert: updated });
}

