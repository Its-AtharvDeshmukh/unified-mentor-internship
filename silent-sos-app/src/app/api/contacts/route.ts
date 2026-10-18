import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";

const MAX_CONTACTS_PER_USER = 5;

export async function GET(req: NextRequest) {
  const session = await getServerSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contacts = await prisma.emergencyContact.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ contacts, maxLimit: MAX_CONTACTS_PER_USER });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const count = await prisma.emergencyContact.count({
    where: { userId: session.userId },
  });
  if (count >= MAX_CONTACTS_PER_USER) {
    return NextResponse.json(
      {
        error: `Maximum of ${MAX_CONTACTS_PER_USER} trusted contacts allowed to ensure rapid dispatch.`,
      },
      { status: 400 }
    );
  }

  const body = await req.json();
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const contact = await prisma.emergencyContact.create({
    data: {
      userId: session.userId,
      name: parsed.data.name,
      relationship: parsed.data.relationship,
      phone: parsed.data.phone || null,
      email: parsed.data.email || null,
      notifySms: Boolean(parsed.data.notifySms && parsed.data.phone),
      notifyEmail: Boolean(parsed.data.notifyEmail && parsed.data.email),
      isVerified: true,
    },
  });

  return NextResponse.json({ contact }, { status: 201 });
}

