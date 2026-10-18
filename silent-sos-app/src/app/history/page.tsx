"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, History } from "lucide-react";

export default function HistoryPage() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/alerts?limit=30")
      .then(async (res) => {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setAlerts(data.alerts || []);
      })
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <div className="min-h-screen bg-obsidian text-slate-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-300 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to SOS Console
        </Link>

        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <History className="h-6 w-6 text-rose-400" />
          Alert History & Audit Archive
        </h1>

        {loading ? (
          <div className="p-8 bg-charcoal border border-slate-800 rounded-2xl text-center text-xs text-slate-400">
            Loading alert history...
          </div>
        ) : alerts.length === 0 ? (
          <div className="p-8 bg-charcoal border border-slate-800 rounded-2xl text-center text-xs text-slate-400">
            No alerts recorded yet.
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((a) => (
              <div
                key={a.id}
                className="bg-charcoal border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">
                      {new Date(a.triggeredAt).toLocaleString()}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-rose-400 font-semibold">
                      {a.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    GPS: {a.locationStatus} • Dispatched Notifications:{" "}
                    {a.notifications?.length || 0}
                    {a.acknowledgedBy &&
                      ` • Acknowledged by ${a.acknowledgedBy}`}
                  </div>
                </div>
                <Link
                  href={`/alerts/${a.id}`}
                  className="text-xs font-semibold text-rose-400 hover:underline"
                >
                  View Full Timeline →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

