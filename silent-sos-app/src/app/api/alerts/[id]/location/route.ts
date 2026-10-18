import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { locationUpdateSchema } from "@/lib/validations";

export async function POST(
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

  if (!alert || alert.userId !== session.userId) {
    return NextResponse.json({ error: "Alert not found" }, { status: 404 });
  }

  if (alert.status === "RESOLVED") {
    return NextResponse.json(
      { error: "Alert is already resolved. Location tracking has stopped." },
      { status: 400 }
    );
  }

  const body = await req.json();
  const parsed = locationUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { latitude, longitude, accuracy } = parsed.data;
  const now = new Date();

  const updated = await prisma.$transaction(async (tx) => {
    await tx.locationUpdate.create({
      data: {
        alertId: alert.id,
        latitude,
        longitude,
        accuracy: accuracy ?? null,
      },
    });

    return tx.emergencyAlert.update({
      where: { id: alert.id },
      data: {
        latitude,
        longitude,
        accuracy: accuracy ?? null,
        locationStatus: "AVAILABLE",
        lastLocationAt: now,
      },
    });
  });

  return NextResponse.json({ alert: updated });
}

