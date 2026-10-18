export interface EmergencyPayload {
  alertId: string;
  userName: string;
  triggeredAtIso: string;
  responderUrl: string;
  latitude?: number | null;
  longitude?: number | null;
  accuracy?: number | null;
  locationStatus: string;
}

export interface DispatchResult {
  status: "SENT" | "DELIVERED_SANDBOX" | "FAILED";
  provider: "SANDBOX" | "TWILIO" | "RESEND";
  providerMessageId?: string;
  errorMessage?: string;
  retryCount: number;
}

function formatMessageText(payload: EmergencyPayload): string {
  const coordsText =
    payload.latitude != null && payload.longitude != null
      ? `Coordinates: ${payload.latitude.toFixed(5)}, ${payload.longitude.toFixed(
          5
        )} (±${Math.round(payload.accuracy ?? 0)}m)`
      : `Location: ${payload.locationStatus} (User device could not acquire GPS fix)`;

  return [
    `[SILENT SOS EMERGENCY ALERT]`,
    `${payload.userName} triggered a silent emergency alert at ${new Date(
      payload.triggeredAtIso
    ).toLocaleTimeString()}.`,
    coordsText,
    `View live status & acknowledge receipt: ${payload.responderUrl}`,
    `If safe and appropriate, contact local emergency services immediately.`,
  ].join("\n");
}

async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 1
): Promise<{ result?: T; error?: string; retries: number }> {
  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      const result = await fn();
      return { result, retries: attempt };
    } catch (err) {
      if (attempt === maxRetries) {
        return {
          error: err instanceof Error ? err.message : "Unknown provider error",
          retries: attempt,
        };
      }
      attempt++;
      await new Promise((r) => setTimeout(r, 300 * attempt));
    }
  }
  return { error: "Retry exhausted", retries: attempt };
}

export async function sendEmergencySms(
  toPhone: string,
  payload: EmergencyPayload
): Promise<DispatchResult> {
  const mode = process.env.NOTIFICATION_MODE || "sandbox";
  const body = formatMessageText(payload);

  if (
    mode !== "production" ||
    !process.env.TWILIO_ACCOUNT_SID ||
    !process.env.TWILIO_AUTH_TOKEN ||
    !process.env.TWILIO_PHONE_NUMBER
  ) {
    console.info(
      `[SANDBOX SMS -> ${toPhone}] Alert ${payload.alertId} prepared safely without live carrier dispatch.`
    );
    return {
      status: "DELIVERED_SANDBOX",
      provider: "SANDBOX",
      providerMessageId: `sandbox_sms_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 7)}`,
      retryCount: 0,
    };
  }

  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  const outcome = await withRetry(async () => {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ To: toPhone, From: from, Body: body }),
      }
    );
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Twilio HTTP ${res.status}: ${errText.slice(0, 120)}`);
    }
    return (await res.json()) as { sid: string };
  }, 1);

  if (outcome.result) {
    return {
      status: "SENT",
      provider: "TWILIO",
      providerMessageId: outcome.result.sid,
      retryCount: outcome.retries,
    };
  }

  return {
    status: "FAILED",
    provider: "TWILIO",
    errorMessage: outcome.error,
    retryCount: outcome.retries,
  };
}

export async function sendEmergencyEmail(
  toEmail: string,
  payload: EmergencyPayload
): Promise<DispatchResult> {
  const mode = process.env.NOTIFICATION_MODE || "sandbox";
  const textBody = formatMessageText(payload);

  if (mode !== "production" || !process.env.RESEND_API_KEY) {
    console.info(
      `[SANDBOX EMAIL -> ${toEmail}] Alert ${payload.alertId} logged in test adapter.`
    );
    return {
      status: "DELIVERED_SANDBOX",
      provider: "SANDBOX",
      providerMessageId: `sandbox_email_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 7)}`,
      retryCount: 0,
    };
  }

  const outcome = await withRetry(async () => {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:
          process.env.EMAIL_FROM ||
          "Silent SOS <onboarding@resend.dev>",
        to: [toEmail],
        subject: `URGENT: Silent SOS Alert from ${payload.userName}`,
        text: textBody,
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Resend HTTP ${res.status}: ${errText.slice(0, 120)}`);
    }
    return (await res.json()) as { id: string };
  }, 1);

  if (outcome.result) {
    return {
      status: "SENT",
      provider: "RESEND",
      providerMessageId: outcome.result.id,
      retryCount: outcome.retries,
    };
  }

  return {
    status: "FAILED",
    provider: "RESEND",
    errorMessage: outcome.error,
    retryCount: outcome.retries,
  };
}

