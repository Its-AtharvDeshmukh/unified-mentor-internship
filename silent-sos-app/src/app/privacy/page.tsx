"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";

export default function PrivacyAndSettingsPage() {
  const [holdDurationMs, setHoldDurationMs] = useState(1500);
  const [shareLiveLocation, setShareLiveLocation] = useState(true);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.user) {
          setHoldDurationMs(d.user.holdDurationMs);
          setShareLiveLocation(d.user.shareLiveLocation);
        }
      });
  }, []);

  async function savePreferences(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ holdDurationMs, shareLiveLocation }),
    });
    if (res.ok) {
      setSavedMessage("Safety preferences updated.");
      setTimeout(() => setSavedMessage(null), 3000);
    }
  }

  return (
    <div className="min-h-screen bg-obsidian text-slate-100 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs text-slate-300 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Return to SOS Console
        </Link>

        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Lock className="h-6 w-6 text-rose-400" />
          Privacy Notice & Discreet Trigger Settings
        </h1>

        <form
          onSubmit={savePreferences}
          className="bg-charcoal border border-slate-800 rounded-2xl p-6 space-y-4"
        >
          <h2 className="text-base font-bold text-white">
            Personal Activation & Location Preferences
          </h2>

          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Press-and-Hold Activation Duration: {(holdDurationMs / 1000).toFixed(1)}s
            </label>
            <input
              type="range"
              min={800}
              max={3500}
              step={100}
              value={holdDurationMs}
              onChange={(e) => setHoldDurationMs(Number(e.target.value))}
              className="w-full accent-rose-500"
            />
          </div>

          <label className="flex items-center gap-2.5 text-xs text-slate-200">
            <input
              type="checkbox"
              checked={shareLiveLocation}
              onChange={(e) => setShareLiveLocation(e.target.checked)}
            />
            Enable continuous live GPS updates while an emergency alert is active
          </label>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs"
            >
              Save Preferences
            </button>
            {savedMessage && (
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" /> {savedMessage}
              </span>
            )}
          </div>
        </form>

        <div className="bg-charcoal border border-slate-800 rounded-2xl p-6 space-y-3 text-xs text-slate-300 leading-relaxed">
          <h2 className="text-base font-bold text-white">
            Data Collection, Retention & Browser Constraints
          </h2>
          <p>
            <strong>1. Deliberate Location Collection:</strong> Silent SOS never
            collects location coordinates in the background during normal
            browsing. Coordinates are requested only when you activate an SOS or
            click &ldquo;Test GPS Fix&rdquo;.
          </p>
          <p>
            <strong>2. Revocable Responder Tokens:</strong> Trusted contacts
            access your live status via a 192-bit cryptographic share token that
            automatically expires upon alert resolution or after 24 hours.
          </p>
          <p>
            <strong>3. Honest Web Platform Limitations:</strong> Because this is
            a browser-based web application, locking your phone screen or
            minimizing the browser may pause continuous background GPS updates
            depending on mobile OS power policies. Your initial SOS dispatch is
            still transmitted immediately by the server.
          </p>
        </div>
      </div>
    </div>
  );
}

