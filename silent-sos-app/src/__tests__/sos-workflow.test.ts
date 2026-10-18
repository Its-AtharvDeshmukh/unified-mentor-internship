import { describe, it, expect } from "vitest";
import {
  registerSchema,
  contactSchema,
  createSosSchema,
  canTransitionAlertStatus,
} from "../lib/validations";
import { checkRateLimit } from "../lib/rate-limit";
import { sendEmergencySms, sendEmergencyEmail } from "../lib/notifications";

describe("Silent SOS Validation, Lifecycle & Notification Sandbox Suite", () => {
  it("validates user registration and rejects weak passwords", () => {
    const valid = registerSchema.safeParse({
      name: "Ananya Sharma",
      email: "ananya@example.com",
      phone: "+15550199001",
      password: "StrongPassword123",
    });
    expect(valid.success).toBe(true);

    const invalid = registerSchema.safeParse({
      name: "A",
      email: "bad-email",
      password: "short",
    });
    expect(invalid.success).toBe(false);
  });

  it("enforces E.164 phone or email requirement on trusted contacts", () => {
    const validContact = contactSchema.safeParse({
      name: "Rohan Sharma",
      relationship: "Sibling",
      phone: "+15550199001",
      email: "",
      notifySms: true,
      notifyEmail: false,
    });
    expect(validContact.success).toBe(true);

    const missingChannels = contactSchema.safeParse({
      name: "No Contact Method",
      relationship: "Friend",
      phone: "",
      email: "",
    });
    expect(missingChannels.success).toBe(false);
  });

  it("permits SOS creation even when GPS permission is denied", () => {
    const deniedLocationPayload = createSosSchema.safeParse({
      idempotencyKey: "idem_key_123456789",
      location: null,
      locationStatus: "DENIED",
    });
    expect(deniedLocationPayload.success).toBe(true);
  });

  it("enforces strict server-side alert lifecycle state transitions", () => {
    expect(canTransitionAlertStatus("CREATED", "SENT")).toBe(true);
    expect(canTransitionAlertStatus("SENT", "ACKNOWLEDGED")).toBe(true);
    expect(canTransitionAlertStatus("ACKNOWLEDGED", "RESOLVED")).toBe(true);
    // Cannot reopen a RESOLVED alert
    expect(canTransitionAlertStatus("RESOLVED", "SENT")).toBe(false);
    expect(canTransitionAlertStatus("RESOLVED", "ACKNOWLEDGED")).toBe(false);
  });

  it("dispatches notifications in sandbox mode without contacting live carriers", async () => {
    process.env.NOTIFICATION_MODE = "sandbox";
    const payload = {
      alertId: "test_alert_01",
      userName: "Test User",
      triggeredAtIso: new Date().toISOString(),
      responderUrl: "http://localhost:3000/respond/token123",
      latitude: 21.0952,
      longitude: 79.0988,
      accuracy: 12,
      locationStatus: "AVAILABLE",
    };

    const smsRes = await sendEmergencySms("+15550100001", payload);
    expect(smsRes.status).toBe("DELIVERED_SANDBOX");
    expect(smsRes.provider).toBe("SANDBOX");

    const emailRes = await sendEmergencyEmail("test@example.com", payload);
    expect(emailRes.status).toBe("DELIVERED_SANDBOX");
    expect(emailRes.provider).toBe("SANDBOX");
  });

  it("enforces sliding-window rate limits accurately", () => {
    const key = `test_bucket_${Date.now()}`;
    expect(checkRateLimit(key, 2, 10_000).allowed).toBe(true);
    expect(checkRateLimit(key, 2, 10_000).allowed).toBe(true);
    expect(checkRateLimit(key, 2, 10_000).allowed).toBe(false);
  });
});

