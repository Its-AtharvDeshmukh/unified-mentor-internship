import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.emergencyContact.findUnique({
    where: { id: params.id },
  });
  if (!existing || existing.userId !== session.userId) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const updated = await prisma.emergencyContact.update({
    where: { id: params.id },
    data: {
      name: parsed.data.name,
      relationship: parsed.data.relationship,
      phone: parsed.data.phone || null,
      email: parsed.data.email || null,
      notifySms: Boolean(parsed.data.notifySms && parsed.data.phone),
      notifyEmail: Boolean(parsed.data.notifyEmail && parsed.data.email),
    },
  });

  return NextResponse.json({ contact: updated });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.emergencyContact.findUnique({
    where: { id: params.id },
  });
  if (!existing || existing.userId !== session.userId) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }

  await prisma.emergencyContact.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}

