import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(req);
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      holdDurationMs: true,
      shareLiveLocation: true,
      _count: { select: { contacts: true, alerts: true } },
    },
  });

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({
    user,
    notificationMode: process.env.NOTIFICATION_MODE || "sandbox",
  });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const holdDurationMs =
    typeof body.holdDurationMs === "number"
      ? Math.min(Math.max(body.holdDurationMs, 800), 4000)
      : undefined;
  const shareLiveLocation =
    typeof body.shareLiveLocation === "boolean"
      ? body.shareLiveLocation
      : undefined;

  const updated = await prisma.user.update({
    where: { id: session.userId },
    data: {
      ...(holdDurationMs !== undefined ? { holdDurationMs } : {}),
      ...(shareLiveLocation !== undefined ? { shareLiveLocation } : {}),
    },
    select: {
      id: true,
      name: true,
      email: true,
      holdDurationMs: true,
      shareLiveLocation: true,
    },
  });

  return NextResponse.json({ user: updated });
}

