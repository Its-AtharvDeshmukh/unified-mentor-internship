"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Radio, ShieldAlert } from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/summary?status=${statusFilter}`)
      .then(async (res) => {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        if (res.status === 403) {
          setError("Administrator authorization required.");
          return;
        }
        setData(await res.json());
      })
      .catch(() => setError("Failed to load administrator telemetry."));
  }, [statusFilter, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-obsidian text-slate-100 p-8 max-w-3xl mx-auto">
        <Link href="/dashboard" className="text-xs text-rose-400 underline">
          ← Return to User Console
        </Link>
        <div className="mt-4 p-6 bg-charcoal border border-rose-800 rounded-xl text-sm text-rose-200">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian text-slate-100 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs text-slate-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to User Console
          </Link>
          <span className="text-xs px-2.5 py-1 rounded bg-amber-950/60 border border-amber-700 text-amber-300">
            Audited Admin View (Not Police Dispatch)
          </span>
        </div>

        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Radio className="h-6 w-6 text-amber-400" />
          Safety Operations Monitoring Dashboard
        </h1>

        {data && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-charcoal border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400">Active Alerts</div>
                <div className="text-2xl font-bold text-rose-400 mt-1">
                  {data.metrics.activeCount}
                </div>
              </div>
              <div className="bg-charcoal border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400">Total Logged</div>
                <div className="text-2xl font-bold text-white mt-1">
                  {data.metrics.totalAlerts}
                </div>
              </div>
              <div className="bg-charcoal border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400">Acknowledgment Rate</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">
                  {data.metrics.acknowledgedRate}%
                </div>
              </div>
              <div className="bg-charcoal border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400">Avg Response Time</div>
                <div className="text-2xl font-bold text-white mt-1">
                  {data.metrics.avgResponseSeconds !== null
                    ? `${data.metrics.avgResponseSeconds}s`
                    : "N/A"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {["ALL", "SENT", "ACKNOWLEDGED", "RESOLVED", "FAILED"].map(
                (st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                      statusFilter === st
                        ? "bg-rose-600 text-white"
                        : "bg-charcoal text-slate-300 border border-slate-800"
                    }`}
                  >
                    {st}
                  </button>
                )
              )}
            </div>

            <div className="bg-charcoal border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/50">
                    <th className="p-3.5">User</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Triggered</th>
                    <th className="p-3.5">GPS Status</th>
                    <th className="p-3.5">Notifications</th>
                    <th className="p-3.5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {data.alerts.map((a: any) => (
                    <tr key={a.id}>
                      <td className="p-3.5 font-medium text-white">
                        {a.user?.name}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200">
                          {a.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-300">
                        {new Date(a.triggeredAt).toLocaleString()}
                      </td>
                      <td className="p-3.5 text-slate-300">
                        {a.locationStatus}
                      </td>
                      <td className="p-3.5 text-slate-300">
                        {a.notifications?.length || 0} attempts
                      </td>
                      <td className="p-3.5">
                        <Link
                          href={`/alerts/${a.id}`}
                          className="text-rose-400 hover:underline flex items-center gap-1"
                        >
                          <ShieldAlert className="h-3.5 w-3.5" /> Inspect
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

