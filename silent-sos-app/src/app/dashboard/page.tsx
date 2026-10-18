"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  MapPin,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  History,
  Lock,
  Radio,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  holdDurationMs: number;
  shareLiveLocation: boolean;
  _count: { contacts: number; alerts: number };
}

interface AlertRecord {
  id: string;
  status: string;
  shareToken: string;
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  locationStatus: string;
  triggeredAt: string;
  acknowledgedAt: string | null;
  acknowledgedBy: string | null;
  resolvedAt: string | null;
  notifications: Array<{
    id: string;
    recipientName: string;
    channel: string;
    status: string;
  }>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [notificationMode, setNotificationMode] = useState<string>("sandbox");
  const [activeAlert, setActiveAlert] = useState<AlertRecord | null>(null);
  const [recentAlerts, setRecentAlerts] = useState<AlertRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Geolocation state
  const [geoPermission, setGeoPermission] = useState<
    "prompt" | "granted" | "denied" | "unsupported"
  >("prompt");
  const [currentCoords, setCurrentCoords] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: number;
  } | null>(null);

  // Deliberate Press-and-Hold state
  const [holdProgress, setHoldProgress] = useState(0);
  const [isTriggering, setIsTriggering] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState("");
  const holdTimerRef = useRef<number | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [meRes, alertsRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/alerts?limit=5"),
      ]);

      if (meRes.status === 401) {
        router.push("/login");
        return;
      }

      const meData = await meRes.json();
      const alertsData = await alertsRes.json();

      setUser(meData.user);
      setNotificationMode(meData.notificationMode || "sandbox");

      const list: AlertRecord[] = alertsData.alerts || [];
      setRecentAlerts(list);

      const currentActive = list.find((a) =>
        ["CREATED", "PROCESSING", "SENT", "ACKNOWLEDGED"].includes(a.status)
      );
      setActiveAlert(currentActive || null);
    } catch (e) {
      console.error("Failed loading dashboard:", e);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Check geolocation permission state
  useEffect(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setGeoPermission("unsupported");
      return;
    }
    if ("permissions" in navigator) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((res) => {
          setGeoPermission(res.state);
          res.onchange = () => setGeoPermission(res.state);
        })
        .catch(() => {});
    }
  }, []);

  // Continuous live location telemetry while an alert is active
  useEffect(() => {
    if (
      !activeAlert ||
      activeAlert.status === "RESOLVED" ||
      !user?.shareLiveLocation ||
      typeof window === "undefined" ||
      !("geolocation" in navigator)
    ) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp,
        };
        setCurrentCoords(coords);
        setGeoPermission("granted");

        try {
          await fetch(`/api/alerts/${activeAlert.id}/location`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              latitude: coords.latitude,
              longitude: coords.longitude,
              accuracy: coords.accuracy,
            }),
          });
        } catch {
          // Silently ignore transient network blips during live tracking
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setGeoPermission("denied");
        }
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [activeAlert, user?.shareLiveLocation]);

  function acquireSinglePosition(): Promise<{
    coords: { latitude: number; longitude: number; accuracy: number } | null;
    status: "AVAILABLE" | "DENIED" | "UNAVAILABLE";
  }> {
    return new Promise((resolve) => {
      if (typeof window === "undefined" || !("geolocation" in navigator)) {
        resolve({ coords: null, status: "UNAVAILABLE" });
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGeoPermission("granted");
          const c = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          };
          setCurrentCoords({ ...c, timestamp: pos.timestamp });
          resolve({ coords: c, status: "AVAILABLE" });
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            setGeoPermission("denied");
            resolve({ coords: null, status: "DENIED" });
          } else {
            resolve({ coords: null, status: "UNAVAILABLE" });
          }
        },
        { enableHighAccuracy: true, timeout: 3500, maximumAge: 15000 }
      );
    });
  }

  const triggerSilentSos = useCallback(async () => {
    if (isTriggering || activeAlert) return;
    setIsTriggering(true);
    setStatusMessage("Acquiring GPS & dispatching silent alert...");

    try {
      const geo = await acquireSinglePosition();
      const idempotencyKey = `sos_${user?.id || "anon"}_${Math.floor(
        Date.now() / 10000
      )}`;

      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idempotencyKey,
          location: geo.coords,
          locationStatus: geo.status,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatusMessage(
          data.error || "Alert dispatch failed. Check connection."
        );
      } else {
        setActiveAlert(data.alert);
        setStatusMessage(
          `Alert ${data.alert.status}: Processed in ${data.processingTimeMs}ms.`
        );
        fetchDashboardData();
      }
    } catch {
      setStatusMessage(
        "Network unreachable. Unable to confirm server alert creation."
      );
    } finally {
      setIsTriggering(false);
      setHoldProgress(0);
    }
  }, [activeAlert, fetchDashboardData, isTriggering, user?.id]);

  function startHold() {
    if (isTriggering || activeAlert) return;
    const duration = user?.holdDurationMs || 1500;
    const intervalMs = 30;
    const start = Date.now();

    if (holdTimerRef.current) window.clearInterval(holdTimerRef.current);
    holdTimerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setHoldProgress(pct);
      if (pct >= 100) {
        if (holdTimerRef.current) window.clearInterval(holdTimerRef.current);
        holdTimerRef.current = null;
        triggerSilentSos();
      }
    }, intervalMs);
  }

  function cancelHold() {
    if (holdTimerRef.current) {
      window.clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (!isTriggering) {
      setHoldProgress(0);
    }
  }

  async function handleResolveAlert(e: React.FormEvent) {
    e.preventDefault();
    if (!activeAlert) return;
    const res = await fetch(`/api/alerts/${activeAlert.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "RESOLVE",
        note: resolutionNote || "Resolved safely by user.",
      }),
    });
    if (res.ok) {
      setResolutionNote("");
      setStatusMessage("Alert marked RESOLVED. Live GPS sharing stopped.");
      fetchDashboardData();
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center p-6">
        <div className="text-sm text-slate-400 animate-pulse">
          Loading discreet safety console...
        </div>
      </div>
    );
  }

  const contactCount = user?._count.contacts ?? 0;

  return (
    <div className="min-h-screen bg-obsidian text-slate-100 flex flex-col md:flex-row">
      {/* Compact Navigation Sidebar */}
      <aside className="w-full md:w-64 bg-charcoal border-b md:border-b-0 md:border-r border-slate-800 p-4 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center justify-between md:justify-start gap-2.5 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <span className="font-bold text-white">
                Silent<span className="text-rose-500">SOS</span>
              </span>
            </div>
            <span className="text-[11px] uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {notificationMode}
            </span>
          </div>

          <nav
            aria-label="Dashboard Navigation"
            className="mt-4 flex md:flex-col gap-1.5 overflow-x-auto"
          >
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-slate-800/90 text-white text-xs sm:text-sm font-medium shrink-0"
            >
              <ShieldAlert className="h-4 w-4 text-rose-400" />
              SOS Console
            </Link>
            <Link
              href="/contacts"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800/50 text-xs sm:text-sm shrink-0"
            >
              <span className="flex items-center gap-2.5">
                <Users className="h-4 w-4 text-slate-400" />
                Trusted Contacts
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                {contactCount}/5
              </span>
            </Link>
            <Link
              href="/history"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800/50 text-xs sm:text-sm shrink-0"
            >
              <History className="h-4 w-4 text-slate-400" />
              Alert History
            </Link>
            <Link
              href="/privacy"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800/50 text-xs sm:text-sm shrink-0"
            >
              <Lock className="h-4 w-4 text-slate-400" />
              Privacy & GPS Controls
            </Link>
            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-amber-300 hover:bg-amber-950/40 text-xs sm:text-sm shrink-0"
              >
                <Radio className="h-4 w-4 text-amber-400" />
                Admin Monitor
              </Link>
            )}
          </nav>
        </div>

        <div className="hidden md:block pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400 truncate mb-2">
            Signed in as <strong className="text-slate-200">{user?.name}</strong>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800 transition"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-6">
        {/* Live Screen Reader Status Region */}
        <div aria-live="polite" className="sr-only">
          {statusMessage}
        </div>

        {/* Warning if zero contacts are configured */}
        {contactCount === 0 && (
          <div className="p-4 rounded-xl bg-amber-950/50 border border-amber-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h2 className="text-sm font-semibold text-amber-200">
                  No Trusted Contacts Configured Yet
                </h2>
                <p className="text-xs text-amber-300/90 mt-0.5">
                  Add at least one trusted contact so your Silent SOS dispatches
                  SMS or email notifications immediately.
                </p>
              </div>
            </div>
            <Link
              href="/contacts"
              className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs shrink-0"
            >
              Add Contacts Now
            </Link>
          </div>
        )}

        {/* Readiness Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-charcoal border border-slate-800 rounded-xl p-4">
            <div className="text-xs text-slate-400">System Status</div>
            <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-white">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  activeAlert ? "bg-rose-500 animate-ping" : "bg-emerald-400"
                }`}
              />
              {activeAlert
                ? `ACTIVE ALERT (${activeAlert.status})`
                : "Standby — Ready"}
            </div>
          </div>

          <div className="bg-charcoal border border-slate-800 rounded-xl p-4">
            <div className="text-xs text-slate-400">Trusted Contacts Ready</div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-sm font-semibold text-white">
                {contactCount} Active Recipient{contactCount === 1 ? "" : "s"}
              </span>
              <Link
                href="/contacts"
                className="text-xs text-rose-400 hover:underline"
              >
                Manage
              </Link>
            </div>
          </div>

          <div className="bg-charcoal border border-slate-800 rounded-xl p-4">
            <div className="text-xs text-slate-400">Location Telemetry</div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-sm font-semibold text-white capitalize">
                GPS: {geoPermission}
              </span>
              <button
                type="button"
                onClick={() => acquireSinglePosition()}
                className="text-xs text-slate-300 hover:text-white underline"
              >
                Test GPS Fix
              </button>
            </div>
          </div>
        </div>

        {/* Core Discreet SOS Trigger or Active Alert Lifecycle Panel */}
        {!activeAlert ? (
          <section
            aria-label="Silent Emergency Trigger"
            className="bg-charcoal border border-slate-800 rounded-2xl p-6 sm:p-10 text-center flex flex-col items-center"
          >
            <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
              Discreet Activation Pad (Zero Audio / No Flash)
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white mt-2">
              Press and Hold to Dispatch Silent SOS
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mt-1">
              Hold the button below for{" "}
              {((user?.holdDurationMs || 1500) / 1000).toFixed(1)} seconds—or use
              the instant discreet trigger if you cannot hold.
            </p>

            {/* Deliberate Hold Button */}
            <div className="my-8 relative flex items-center justify-center">
              <button
                type="button"
                aria-label="Press and hold to trigger silent emergency alert"
                onMouseDown={startHold}
                onMouseUp={cancelHold}
                onMouseLeave={cancelHold}
                onTouchStart={startHold}
                onTouchEnd={cancelHold}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") startHold();
                }}
                onKeyUp={(e) => {
                  if (e.key === " " || e.key === "Enter") cancelHold();
                }}
                disabled={isTriggering}
                className="relative h-44 w-44 sm:h-48 sm:w-48 rounded-full bg-slate-900 border-2 border-rose-600/70 hover:border-rose-500 flex flex-col items-center justify-center select-none focus:outline-none focus:ring-4 focus:ring-rose-500/40 transition overflow-hidden"
              >
                {/* Subtle upward fill progress bar */}
                <div
                  className="absolute bottom-0 left-0 right-0 bg-rose-700/40 transition-all duration-75"
                  style={{ height: `${holdProgress}%` }}
                  aria-hidden="true"
                />
                <ShieldAlert className="h-10 w-10 text-rose-400 relative z-10 mb-2" />
                <span className="text-base font-bold text-white relative z-10">
                  {isTriggering
                    ? "DISPATCHING..."
                    : holdProgress > 0
                    ? `HOLD (${holdProgress}%)`
                    : "HOLD FOR SOS"}
                </span>
                <span className="text-[11px] text-slate-400 relative z-10 mt-1">
                  Silent • No Siren
                </span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
              <button
                type="button"
                onClick={triggerSilentSos}
                disabled={isTriggering}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition"
              >
                Instant One-Click Trigger (Accessibility Fallback)
              </button>
            </div>

            {statusMessage && (
              <p className="mt-4 text-xs text-slate-300 bg-slate-900 px-3 py-1.5 rounded-md border border-slate-800">
                {statusMessage}
              </p>
            )}
          </section>
        ) : (
          /* Active Alert Live Status & Safe Resolution Panel */
          <section
            aria-label="Active Emergency Alert Status"
            className="bg-slate-900/90 border-2 border-rose-600/60 rounded-2xl p-6 space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400">
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                  Silent SOS Active — Status: {activeAlert.status}
                </div>
                <h2 className="text-lg font-bold text-white mt-1">
                  Alert ID: {activeAlert.id}
                </h2>
                <p className="text-xs text-slate-400">
                  Triggered at{" "}
                  {new Date(activeAlert.triggeredAt).toLocaleTimeString()}
                </p>
              </div>
              <Link
                href={`/alerts/${activeAlert.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                Full Timeline & Audit Log <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Live Location & Acknowledgment Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-charcoal border border-slate-800 space-y-1.5">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-rose-400" />
                  Authorized Location Telemetry
                </div>
                {activeAlert.latitude && activeAlert.longitude ? (
                  <div className="text-sm font-mono text-white">
                    {activeAlert.latitude.toFixed(5)},{" "}
                    {activeAlert.longitude.toFixed(5)}{" "}
                    <span className="text-xs text-slate-400">
                      (±{Math.round(activeAlert.accuracy || 0)}m)
                    </span>
                  </div>
                ) : (
                  <div className="text-xs text-amber-300">
                    Location Status: {activeAlert.locationStatus} (Alert still
                    dispatched without coordinates)
                  </div>
                )}
                <div className="text-[11px] text-slate-400">
                  Responder Share Link:{" "}
                  <Link
                    href={`/respond/${activeAlert.shareToken}`}
                    className="text-rose-400 underline break-all"
                  >
                    /respond/{activeAlert.shareToken.slice(0, 12)}...
                  </Link>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-charcoal border border-slate-800 space-y-1.5">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Contact Acknowledgment & Delivery
                </div>
                {activeAlert.acknowledgedAt ? (
                  <div className="text-sm font-semibold text-emerald-300">
                    Acknowledged by {activeAlert.acknowledgedBy} at{" "}
                    {new Date(activeAlert.acknowledgedAt).toLocaleTimeString()}
                  </div>
                ) : (
                  <div className="text-xs text-slate-300">
                    Awaiting trusted contact acknowledgment...
                  </div>
                )}
                <div className="text-xs text-slate-400 pt-1">
                  Dispatched Attempts:{" "}
                  {activeAlert.notifications?.length || 0} recorded
                </div>
              </div>
            </div>

            {/* Safe Resolution Flow (Does not erase historical dispatch record) */}
            <form
              onSubmit={handleResolveAlert}
              className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3"
            >
              <input
                type="text"
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="Optional safety note (e.g., Reached safe location, false alarm)"
                className="flex-1 px-3.5 py-2 rounded-lg bg-charcoal border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shrink-0 transition"
              >
                <ShieldCheck className="h-4 w-4" />
                Mark Safe & Resolve Alert
              </button>
            </form>
          </section>
        )}

        {/* Recent Activity Summary */}
        <section className="bg-charcoal border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              Recent Emergency Alerts
            </h2>
            <Link
              href="/history"
              className="text-xs text-rose-400 hover:underline"
            >
              View All →
            </Link>
          </div>

          {recentAlerts.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No emergency alerts have been triggered on this account.
            </p>
          ) : (
            <div className="divide-y divide-slate-800">
              {recentAlerts.map((item) => (
                <div
                  key={item.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <span className="font-semibold text-white">
                      {new Date(item.triggeredAt).toLocaleString()}
                    </span>
                    <span className="ml-2 px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                      {item.status}
                    </span>
                    <div className="text-slate-400 mt-0.5">
                      Location: {item.locationStatus} • Notifications:{" "}
                      {item.notifications?.length || 0}
                    </div>
                  </div>
                  <Link
                    href={`/alerts/${item.id}`}
                    className="text-rose-400 hover:underline font-medium"
                  >
                    Inspect Timeline →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

