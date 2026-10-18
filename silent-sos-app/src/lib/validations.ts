import { z } from "zod";

const phoneRegex = /^\+?[1-9]\d{7,14}$/;

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().email("Enter a valid email address").toLowerCase(),
  phone: z
    .string()
    .regex(phoneRegex, "Use international E.164 format (e.g., +15550199001)")
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export const contactSchema = z
  .object({
    name: z.string().min(2, "Contact name is required").max(80),
    relationship: z.string().min(2, "Relationship label is required").max(50),
    phone: z
      .string()
      .regex(phoneRegex, "Phone must be E.164 format, e.g. +15550199001")
      .optional()
      .or(z.literal("")),
    email: z
      .string()
      .email("Invalid email address")
      .toLowerCase()
      .optional()
      .or(z.literal("")),
    notifySms: z.boolean().default(true),
    notifyEmail: z.boolean().default(true),
  })
  .refine((data) => Boolean(data.phone || data.email), {
    message: "Provide at least a valid phone number or email address",
    path: ["phone"],
  });

export const createSosSchema = z.object({
  idempotencyKey: z.string().min(8).max(128),
  triggerNote: z.string().max(280).optional(),
  location: z
    .object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
      accuracy: z.number().min(0).optional(),
    })
    .nullable()
    .optional(),
  locationStatus: z
    .enum(["AVAILABLE", "UNAVAILABLE", "DENIED", "PENDING"])
    .default("UNAVAILABLE"),
});

export const locationUpdateSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().min(0).optional(),
});

export const alertActionSchema = z.object({
  action: z.enum(["ACKNOWLEDGE", "RESOLVE"]),
  actorName: z.string().max(80).optional(),
  note: z.string().max(300).optional(),
});

export type AlertStatusType =
  | "CREATED"
  | "PROCESSING"
  | "SENT"
  | "ACKNOWLEDGED"
  | "RESOLVED"
  | "FAILED";

const VALID_TRANSITIONS: Record<AlertStatusType, AlertStatusType[]> = {
  CREATED: ["PROCESSING", "SENT", "FAILED", "RESOLVED"],
  PROCESSING: ["SENT", "FAILED", "ACKNOWLEDGED", "RESOLVED"],
  SENT: ["ACKNOWLEDGED", "RESOLVED"],
  ACKNOWLEDGED: ["RESOLVED"],
  FAILED: ["SENT", "ACKNOWLEDGED", "RESOLVED"],
  RESOLVED: [], // Terminal state — cannot be reopened
};

export function canTransitionAlertStatus(
  current: AlertStatusType,
  next: AlertStatusType
): boolean {
  if (current === next) return true;
  return VALID_TRANSITIONS[current]?.includes(next) ?? false;
}

