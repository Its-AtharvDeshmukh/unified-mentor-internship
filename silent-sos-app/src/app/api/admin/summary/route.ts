import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(req);
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden: Administrator clearance required." },
      { status: 403 }
    );
  }

  const statusFilter = req.nextUrl.searchParams.get("status") || "ALL";

  const alerts = await prisma.emergencyAlert.findMany({
    where:
      statusFilter !== "ALL"
        ? { status: statusFilter }
        : undefined,
    include: {
      user: { select: { name: true, email: true } },
      notifications: true,
    },
    orderBy: { triggeredAt: "desc" },
    take: 50,
  });

  const allAlerts = await prisma.emergencyAlert.findMany({
    select: {
      status: true,
      triggeredAt: true,
      acknowledgedAt: true,
    },
  });

  const activeCount = allAlerts.filter((a) =>
    ["CREATED", "PROCESSING", "SENT", "ACKNOWLEDGED"].includes(a.status)
  ).length;

  const acknowledgedAlerts = allAlerts.filter(
    (a) => a.acknowledgedAt && a.triggeredAt
  );

  const avgResponseSeconds =
    acknowledgedAlerts.length > 0
      ? Math.round(
          acknowledgedAlerts.reduce(
            (acc, item) =>
              acc +
              (item.acknowledgedAt!.getTime() - item.triggeredAt.getTime()) /
                1000,
            0
          ) / acknowledgedAlerts.length
        )
      : null;

  return NextResponse.json({
    metrics: {
      totalAlerts: allAlerts.length,
      activeCount,
      resolvedCount: allAlerts.filter((a) => a.status === "RESOLVED").length,
      acknowledgedRate:
        allAlerts.length > 0
          ? Math.round((acknowledgedAlerts.length / allAlerts.length) * 100)
          : 0,
      avgResponseSeconds,
    },
    alerts,
  });
}

