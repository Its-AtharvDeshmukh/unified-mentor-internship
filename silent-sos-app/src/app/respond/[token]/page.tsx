"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ShieldAlert, MapPin, CheckCircle2, PhoneCall } from "lucide-react";

export default function ResponderTokenPage() {
  const params = useParams<{ token: string }>();
  const [alert, setAlert] = useState<any>(null);
  const [responderName, setResponderName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [acknowledging, setAcknowledging] = useState(false);

  async function loadAlert() {
    const res = await fetch(`/api/respond/${params.token}`);
    const data = await res.json();
    if (!res.ok) setError(data.error || "Invalid link.");
    else setAlert(data.alert);
  }

  useEffect(() => {
    loadAlert();
  }, [params.token]);

  async function handleAcknowledge(e: React.FormEvent) {
    e.preventDefault();
    setAcknowledging(true);
    const res = await fetch(`/api/respond/${params.token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ responderName: responderName || "Trusted Contact" }),
    });
    if (res.ok) {
      await loadAlert();
    }
    setAcknowledging(false);
  }

  if (error) {
    return (
      <div className="min-h-screen bg-obsidian text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-charcoal border border-slate-800 rounded-2xl p-6 text-center space-y-2">
          <h1 className="text-lg font-bold text-white">Link Unavailable</h1>
          <p className="text-xs text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!alert) {
    return (
      <div className="min-h-screen bg-obsidian text-slate-400 flex items-center justify-center text-sm">
        Loading emergency responder view...
      </div>
    );
  }

  const mapsUrl =
    alert.latitude && alert.longitude
      ? `https://www.openstreetmap.org/?mlat=${alert.latitude}&mlon=${alert.longitude}#map=16/${alert.latitude}/${alert.longitude}`
      : null;

  return (
    <div className="min-h-screen bg-obsidian text-slate-100 p-4 sm:p-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-charcoal border-2 border-rose-600/60 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2.5 text-rose-400 text-xs font-bold uppercase tracking-wider">
          <ShieldAlert className="h-5 w-5" />
          Silent SOS Trusted Responder Portal
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white">
            {alert.user.name} requested emergency assistance
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Triggered at {new Date(alert.triggeredAt).toLocaleString()} •
            Current Status: <strong className="text-white">{alert.status}</strong>
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-rose-400" />
            Last Known GPS Coordinates
          </div>
          {alert.latitude && alert.longitude ? (
            <>
              <div className="text-sm font-mono text-white">
                {alert.latitude.toFixed(5)}, {alert.longitude.toFixed(5)} (±
                {Math.round(alert.accuracy || 0)}m)
              </div>
              {mapsUrl && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-xs text-rose-400 underline pt-1"
                >
                  Open Coordinates in OpenStreetMap ↗
                </a>
              )}
            </>
          ) : (
            <p className="text-xs text-amber-300">
              GPS coordinates unavailable ({alert.locationStatus}).
            </p>
          )}
        </div>

        {alert.status !== "RESOLVED" && (
          <form onSubmit={handleAcknowledge} className="space-y-3">
            <label className="block text-xs text-slate-300">
              Confirm Receipt (Lets {alert.user.name} know silently on their
              screen that you saw this alert):
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                required
                value={responderName}
                onChange={(e) => setResponderName(e.target.value)}
                placeholder="Your Name (e.g., Rohan)"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              />
              <button
                type="submit"
                disabled={acknowledging}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" />
                {acknowledging ? "Sending..." : "Acknowledge Alert"}
              </button>
            </div>
          </form>
        )}

        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/70 text-xs text-amber-200 flex items-start gap-2.5">
          <PhoneCall className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
          <span>
            Remember: The sender used Silent SOS because speaking aloud may be
            unsafe. Avoid calling their phone directly if a ringing tone could
            escalate danger; coordinate discreetly or contact local emergency
            services (112 / 911).
          </span>
        </div>
      </div>
    </div>
  );
}

