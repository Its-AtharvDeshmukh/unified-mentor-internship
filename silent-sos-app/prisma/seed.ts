import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding safe development data for Silent SOS...");

  await prisma.alertActivity.deleteMany();
  await prisma.notificationAttempt.deleteMany();
  await prisma.locationUpdate.deleteMany();
  await prisma.emergencyAlert.deleteMany();
  await prisma.emergencyContact.deleteMany();
  await prisma.user.deleteMany();

  const userPassword = await bcrypt.hash("SafetyFirst#2026", 10);
  const adminPassword = await bcrypt.hash("AdminMonitor#2026", 10);

  const demoUser = await prisma.user.create({
    data: {
      name: "Ananya Sharma (Demo User)",
      email: "demo@silentsos.example",
      phone: "+15550101001",
      passwordHash: userPassword,
      role: "USER",
      holdDurationMs: 1500,
      shareLiveLocation: true,
    },
  });

  await prisma.user.create({
    data: {
      name: "Safety Operations Admin",
      email: "admin@silentsos.example",
      phone: "+15550109999",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  const contact1 = await prisma.emergencyContact.create({
    data: {
      userId: demoUser.id,
      name: "Rohan Sharma",
      relationship: "Sibling",
      phone: "+15550199001",
      email: "rohan.sandbox@silentsos.example",
      notifySms: true,
      notifyEmail: true,
      isVerified: true,
    },
  });

  const contact2 = await prisma.emergencyContact.create({
    data: {
      userId: demoUser.id,
      name: "Priya Nair",
      relationship: "Trusted Roommate",
      phone: "+15550199002",
      email: "priya.sandbox@silentsos.example",
      notifySms: false,
      notifyEmail: true,
      isVerified: true,
    },
  });

  // Historical Resolved Alert
  const pastAlert = await prisma.emergencyAlert.create({
    data: {
      userId: demoUser.id,
      status: "RESOLVED",
      idempotencyKey: "seed-alert-resolved-001",
      shareToken: "seed-share-token-resolved-001",
      shareTokenExpiry: new Date(Date.now() + 86400000),
      latitude: 21.0952,
      longitude: 79.0988,
      accuracy: 14.5,
      locationStatus: "AVAILABLE",
      lastLocationAt: new Date(Date.now() - 3600000),
      triggeredAt: new Date(Date.now() - 4200000),
      acknowledgedAt: new Date(Date.now() - 4080000),
      acknowledgedBy: "Rohan Sharma (Sibling)",
      resolvedAt: new Date(Date.now() - 3500000),
      resolutionNote: "Reached home safely; cab took an unfamiliar detour.",
    },
  });

  await prisma.notificationAttempt.createMany({
    data: [
      {
        alertId: pastAlert.id,
        contactId: contact1.id,
        recipientName: contact1.name,
        channel: "SMS",
        destination: contact1.phone!,
        status: "DELIVERED_SANDBOX",
        provider: "SANDBOX",
        providerMessageId: "sim_sms_88219a",
      },
      {
        alertId: pastAlert.id,
        contactId: contact2.id,
        recipientName: contact2.name,
        channel: "EMAIL",
        destination: contact2.email!,
        status: "DELIVERED_SANDBOX",
        provider: "SANDBOX",
        providerMessageId: "sim_mail_99104b",
      },
    ],
  });

  await prisma.alertActivity.createMany({
    data: [
      {
        alertId: pastAlert.id,
        actor: "USER",
        action: "ALERT_CREATED",
        details: "Silent SOS triggered via deliberate hold interaction.",
        createdAt: new Date(Date.now() - 4200000),
      },
      {
        alertId: pastAlert.id,
        actor: "SYSTEM",
        action: "NOTIFICATIONS_DISPATCHED",
        details: "Dispatched 2 notifications in SANDBOX mode (2 succeeded).",
        createdAt: new Date(Date.now() - 4195000),
      },
      {
        alertId: pastAlert.id,
        actor: "CONTACT",
        action: "ALERT_ACKNOWLEDGED",
        details: "Acknowledged by Rohan Sharma (Sibling) via secure responder link.",
        createdAt: new Date(Date.now() - 4080000),
      },
      {
        alertId: pastAlert.id,
        actor: "USER",
        action: "ALERT_RESOLVED",
        details: "Resolved by user: Reached home safely; cab took an unfamiliar detour.",
        createdAt: new Date(Date.now() - 3500000),
      },
    ],
  });

  console.log("Seed complete!");
  console.log("Demo User Login:  demo@silentsos.example  / SafetyFirst#2026");
  console.log("Demo Admin Login: admin@silentsos.example / AdminMonitor#2026");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

