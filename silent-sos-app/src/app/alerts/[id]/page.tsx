"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShieldAlert,
  MapPin,
  Clock,
  CheckCircle2,
  Send,
} from "lucide-react";

export default function AlertDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [alert, setAlert] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/alerts/${params.id}`)
      .then(async (res) => {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        if (!res.ok) setError(data.error || "Unable to load alert.");
        else setAlert(data.alert);
      })
      .catch(() => setError("Network error loading alert details."));
  }, [params.id, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-obsidian text-slate-100 p-8 max-w-3xl mx-auto">
        <Link href="/dashboard" className="text-xs text-rose-400 underline">
          ← Return to Dashboard
        </Link>
        <div className="mt-6 p-6 rounded-xl bg-charcoal border border-rose-800 text-sm text-rose-200">
          {error}
        </div>
      </div>
    );
  }

  if (!alert) {
    return (
      <div className="min-h-screen bg-obsidian text-slate-400 p-8 text-center text-sm">
        Loading alert timeline...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian text-slate-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-300 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to SOS Console
        </Link>

        <div className="bg-charcoal border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase px-2.5 py-1 rounded bg-slate-800 text-rose-400">
              Lifecycle State: {alert.status}
            </span>
            <h1 className="text-xl font-bold text-white mt-2 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-400" />
              Emergency Alert #{alert.id}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Triggered: {new Date(alert.triggeredAt).toLocaleString()}
            </p>
          </div>
          {alert.resolvedAt && (
            <div className="text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800 px-3.5 py-2 rounded-xl">
              <div className="font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> Resolved Safely
              </div>
              <div>{new Date(alert.resolvedAt).toLocaleString()}</div>
            </div>
          )}
        </div>

        {/* Notifications & Location Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-charcoal border border-slate-800 rounded-2xl p-5 space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Send className="h-4 w-4 text-rose-400" />
              Notification Delivery Attempts ({alert.notifications.length})
            </h2>
            {alert.notifications.length === 0 ? (
              <p className="text-xs text-slate-400">
                No notification attempts were recorded for this alert.
              </p>
            ) : (
              <div className="space-y-2">
                {alert.notifications.map((n: any) => (
                  <div
                    key={n.id}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-white">
                        {n.recipientName} ({n.channel})
                      </div>
                      <div className="text-slate-400">{n.destination}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[11px]">
                      {n.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-charcoal border border-slate-800 rounded-2xl p-5 space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="h-4 w-4 text-rose-400" />
              Location Telemetry History ({alert.locations.length})
            </h2>
            {alert.locations.length === 0 ? (
              <p className="text-xs text-slate-400">
                No GPS coordinates recorded ({alert.locationStatus}).
              </p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {alert.locations.map((loc: any) => (
                  <div
                    key={loc.id}
                    className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs flex items-center justify-between"
                  >
                    <span className="font-mono text-slate-200">
                      {loc.latitude.toFixed(5)}, {loc.longitude.toFixed(5)} (±
                      {Math.round(loc.accuracy || 0)}m)
                    </span>
                    <span className="text-slate-400">
                      {new Date(loc.recordedAt).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chronological Audit Timeline */}
        <div className="bg-charcoal border border-slate-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-rose-400" />
            Timestamped Activity & Audit Log
          </h2>
          <ol className="relative border-l border-slate-700 ml-3 space-y-4">
            {alert.activities.map((ev: any) => (
              <li key={ev.id} className="ml-4">
                <div className="absolute w-2.5 h-2.5 bg-rose-500 rounded-full -left-1.5 mt-1.5 border border-obsidian" />
                <div className="text-xs text-slate-400">
                  {new Date(ev.createdAt).toLocaleString()} • Actor:{" "}
                  <strong className="text-slate-200">{ev.actor}</strong>
                </div>
                <div className="text-xs font-semibold text-white mt-0.5">
                  {ev.action}
                </div>
                <p className="text-xs text-slate-300 mt-0.5">{ev.details}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

