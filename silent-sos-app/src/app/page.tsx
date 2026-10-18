"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Lock,
  MapPin,
  Users,
  CheckCircle2,
  ArrowRight,
  PhoneCall,
  EyeOff,
  Radio,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  Clock,
  BellRing,
  Menu,
  X,
  RotateCcw,
  Fingerprint,
  KeyRound,
  CloudSun,
  HeartHandshake,
  Navigation,
  Check,
  VolumeX,
} from "lucide-react";

type SimState =
  | "IDLE"
  | "HOLDING"
  | "ACQUIRING_GPS"
  | "DISPATCHED"
  | "ACKNOWLEDGED";

const WORKFLOW_STEPS = [
  {
    id: "01",
    badge: "STEP 1 • PERSONAL CIRCLE",
    title: "Add Your Trusted Safety Circle",
    description:
      "Pre-save up to 5 people you trust completely—family, roommates, or campus safety escorts—and choose whether each person receives SMS, email, or both.",
    timeTag: "60-second setup",
    highlight: "Verified E.164 phone & email validation",
    previewTitle: "Trusted Circle Ready",
    previewItems: [
      { name: "Rohan Sharma", role: "Sibling", channel: "SMS + Email", status: "Ready" },
      { name: "Priya Nair", role: "Roommate", channel: "Email Only", status: "Ready" },
    ],
  },
  {
    id: "02",
    badge: "STEP 2 • SILENT TRIGGER",
    title: "Deliberate Press-and-Hold Activation",
    description:
      "Hold the tactile pad for 1.5 seconds. There are zero sirens, zero voice prompts, and zero jarring flashes—plus a built-in Weather Note disguise if someone glances at your phone.",
    timeTag: "1.5s hold protection",
    highlight: "Prevents accidental pocket dials",
    previewTitle: "Covert Trigger Guard",
    previewItems: [
      { name: "Sound Output", role: "Strictly Muted (0 dB)", channel: "Stealth", status: "Active" },
      { name: "Duplicate Tap Guard", role: "Idempotency Key Lock", channel: "Server", status: "Active" },
    ],
  },
  {
    id: "03",
    badge: "STEP 3 • LIVE GPS STREAM",
    title: "Permission-Based Location Dispatch",
    description:
      "Your browser's GPS coordinates and accuracy radius are attached automatically. Even if you are indoors or GPS permission is denied, the alert still dispatches immediately.",
    timeTag: "< 1.8s server dispatch",
    highlight: "Works with or without GPS lock",
    previewTitle: "Telemetry Packet Dispatched",
    previewItems: [
      { name: "GPS Coordinates", role: "21.0952° N, 79.0988° E", channel: "±11m Accuracy", status: "Streaming" },
      { name: "Share Link", role: "192-bit Revocable Token", channel: "HTTPS", status: "24h Expiry" },
    ],
  },
  {
    id: "04",
    badge: "STEP 4 • PEACE OF MIND",
    title: "Silent Acknowledgment & Safe Resolution",
    description:
      "When your contact opens their link and taps 'Acknowledge', your screen updates quietly so you know help is on the way. Tap 'Resolve' once safe to stop GPS tracking.",
    timeTag: "Instant confirmation",
    highlight: "Automatic privacy cutoff on resolve",
    previewTitle: "Responder Confirmation",
    previewItems: [
      { name: "Rohan Sharma", role: "Opened Responder Map", channel: "Confirmed", status: "On the way" },
      { name: "Live GPS Trail", role: "Auto-terminates on resolve", channel: "Privacy", status: "Protected" },
    ],
  },
];

const FAQS = [
  {
    q: "Why does Silent SOS use a calm daylight theme instead of a dark red panic screen?",
    a: "In real-world harassment, domestic abuse, or stalking situations, an aggressive black-and-red 'EMERGENCY' screen can immediately tip off an aggressor looking over your shoulder. Our Nordic Daylight aesthetic looks calm and ordinary at a glance, reduces cognitive panic, and even includes a 1-tap Weather/Notes disguise mode.",
  },
  {
    q: "What happens if I release the SOS button before 1.5 seconds?",
    a: "Nothing is sent. The deliberate press-and-hold ring smoothly resets to zero without creating any server record or notifying anyone—protecting you from accidental taps while carrying your phone.",
  },
  {
    q: "What if my phone's location permission is turned off or denied?",
    a: "Your emergency alert still goes through! The server records locationStatus as 'DENIED' or 'UNAVAILABLE' and immediately notifies your trusted contacts that you triggered an SOS so they can check on you.",
  },
  {
    q: "How can evaluators test this project without texting real people?",
    a: "The app runs in safe 'sandbox' mode out of the box. Every SMS and email dispatch is simulated, recorded in the database, and viewable on the live responder link (/respond/[token]) without sending real cellular messages until you add production Twilio or Resend API keys.",
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Interactive Hero SOS Simulator + Camouflage Toggle
  const [simState, setSimState] = useState<SimState>("IDLE");
  const [holdProgress, setHoldProgress] = useState(0);
  const [disguiseMode, setDisguiseMode] = useState(false);
  const holdIntervalRef = useRef<number | null>(null);
  const transitionTimeoutRef = useRef<number[]>([]);

  function clearSimTimers() {
    if (holdIntervalRef.current) {
      window.clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    transitionTimeoutRef.current.forEach((id) => window.clearTimeout(id));
    transitionTimeoutRef.current = [];
  }

  useEffect(() => {
    return () => clearSimTimers();
  }, []);

  function startDemoHold() {
    if (simState !== "IDLE" && simState !== "HOLDING") return;
    setSimState("HOLDING");
    const duration = 1300;
    const start = Date.now();

    if (holdIntervalRef.current) window.clearInterval(holdIntervalRef.current);
    holdIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setHoldProgress(pct);

      if (pct >= 100) {
        if (holdIntervalRef.current)
          window.clearInterval(holdIntervalRef.current);
        holdIntervalRef.current = null;
        runDemoLifecycle();
      }
    }, 25);
  }

  function cancelDemoHold() {
    if (simState === "HOLDING" && holdProgress < 100) {
      if (holdIntervalRef.current)
        window.clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
      setHoldProgress(0);
      setSimState("IDLE");
    }
  }

  function runDemoLifecycle() {
    setSimState("ACQUIRING_GPS");
    const t1 = window.setTimeout(() => {
      setSimState("DISPATCHED");
    }, 900);
    const t2 = window.setTimeout(() => {
      setSimState("ACKNOWLEDGED");
    }, 2500);
    transitionTimeoutRef.current.push(t1, t2);
  }

  function resetDemo() {
    clearSimTimers();
    setHoldProgress(0);
    setSimState("IDLE");
  }

  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (holdProgress / 100) * circumference;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-slate-900 relative">
      {/* Subtle Daylight Dot Grid & Pastel Botanical Aura */}
      <div
        className="fixed inset-0 bg-daylight-dots opacity-60 pointer-events-none z-0"
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 bg-pastel-aura pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Top Reassuring Safety Banner */}
      <div className="relative z-40 bg-teal-900 text-teal-50 px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-300" />
            <span>
              <strong className="font-semibold text-white">
                Calm, Discreet Personal Safety:
              </strong>{" "}
              Alerts your trusted circle silently when speaking aloud isn&apos;t
              safe.
            </span>
          </div>
          <span className="text-teal-200 text-[11px]">
            Not a replacement for direct police dispatch • Call{" "}
            <strong className="text-white underline">112 / 911</strong> when
            safe
          </span>
        </div>
      </div>

      {/* Floating Frosted Daylight Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#FAF8F5]/85 border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="h-10 w-10 rounded-2xl bg-teal-700 text-white flex items-center justify-center shadow-sm group-hover:bg-teal-800 transition">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-lg text-slate-900">
                Silent<span className="text-rose-600">SOS</span>
              </span>
              <span className="block text-[10px] font-medium uppercase tracking-widest text-teal-700 -mt-1">
                Personal Safety Network
              </span>
            </div>
          </Link>

          {/* Center Pill Nav */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-1 rounded-full bg-white/90 border border-stone-200/90 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm"
          >
            <a
              href="#interactive-demo"
              className="px-3.5 py-1.5 rounded-full hover:text-slate-900 hover:bg-stone-100 transition"
            >
              Live Simulator
            </a>
            <a
              href="#features"
              className="px-3.5 py-1.5 rounded-full hover:text-slate-900 hover:bg-stone-100 transition"
            >
              Human-First Design
            </a>
            <a
              href="#how-it-works"
              className="px-3.5 py-1.5 rounded-full hover:text-slate-900 hover:bg-stone-100 transition"
            >
              4-Step Flow
            </a>
            <a
              href="#faq"
              className="px-3.5 py-1.5 rounded-full hover:text-slate-900 hover:bg-stone-100 transition"
            >
              FAQs
            </a>
            <Link
              href="/privacy"
              className="px-3.5 py-1.5 rounded-full hover:text-slate-900 hover:bg-stone-100 transition"
            >
              Privacy Controls
            </Link>
          </nav>

          {/* Right CTAs */}
          <div className="hidden md:flex items-center gap-2.5">
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-4 py-2.5 rounded-xl border border-stone-300 hover:border-stone-400 bg-white transition"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl transition shadow-sm flex items-center gap-1.5"
            >
              Create Safety Circle
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open navigation menu"
            className="md:hidden p-2 rounded-xl bg-white border border-stone-200 text-slate-700"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-stone-200 px-4 py-5 space-y-3 text-sm shadow-lg">
            <div className="flex flex-col space-y-2 text-slate-700 font-medium">
              <a
                href="#interactive-demo"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5"
              >
                Live SOS Simulator
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5"
              >
                Human-First Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5"
              >
                How It Works
              </a>
              <Link
                href="/privacy"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5"
              >
                Privacy & GPS Settings
              </Link>
            </div>
            <div className="pt-3 border-t border-stone-200 grid grid-cols-2 gap-3">
              <Link
                href="/login"
                className="text-center py-2.5 rounded-xl bg-stone-100 text-slate-800 font-semibold text-xs"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-center py-2.5 rounded-xl bg-rose-600 text-white font-semibold text-xs"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10 flex-1">
        {/* =========================================================
            HERO SECTION: CALM DAYLIGHT + INTERACTIVE CAMOUFLAGE SIMULATOR
        ========================================================== */}
        <section
          id="interactive-demo"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 lg:pt-16 lg:pb-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Warm, Reassuring Editorial Messaging */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-xs font-semibold text-teal-800 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                <span>Calm Under Pressure • Discreet By Design</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-slate-900 leading-[1.08]">
                Quietly reach the people who care,{" "}
                <span className="text-teal-700 underline decoration-teal-300/80 decoration-wavy underline-offset-8">
                  without making a sound.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                When an uncomfortable ride, unsafe walk home, or sudden medical
                moment makes calling impossible,{" "}
                <strong className="text-slate-900 font-semibold">
                  Silent SOS
                </strong>{" "}
                lets you notify your trusted circle with a gentle press-and-hold.
                Designed to look calm and ordinary on your screen so it never
                draws unwanted attention.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold px-6 py-4 rounded-2xl transition shadow-lg shadow-rose-600/20 focus:outline-none focus:ring-4 focus:ring-rose-500/30"
                >
                  <span>Set Up Your Safety Circle</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 bg-white hover:bg-stone-50 text-slate-800 font-semibold px-6 py-4 rounded-2xl border border-stone-300 shadow-sm transition"
                >
                  <span>Open SOS Dashboard</span>
                </Link>
              </div>

              {/* Trust Pillars */}
              <div className="pt-6 border-t border-stone-200/90 grid grid-cols-3 gap-4 max-w-xl">
                <div className="bg-white/70 border border-stone-200/80 rounded-2xl p-3.5">
                  <div className="text-lg sm:text-xl font-extrabold text-teal-800">
                    Zero Siren
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    No audio, strobes, or panic popups
                  </div>
                </div>
                <div className="bg-white/70 border border-stone-200/80 rounded-2xl p-3.5">
                  <div className="text-lg sm:text-xl font-extrabold text-slate-900">
                    &lt; 2 Sec
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Instant GPS & SMS/Email dispatch
                  </div>
                </div>
                <div className="bg-white/70 border border-stone-200/80 rounded-2xl p-3.5">
                  <div className="text-lg sm:text-xl font-extrabold text-rose-600">
                    Disguise UI
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Blends in like a daily wellness app
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Daylight Tactile Widget + Camouflage Mode */}
            <div className="lg:col-span-5">
              <div className="rounded-[32px] bg-white/95 border border-stone-200/90 p-6 sm:p-7 shadow-tactile relative overflow-hidden">
                {/* Top Simulator Header with Camouflage Switch */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        simState === "IDLE"
                          ? "bg-teal-500"
                          : simState === "ACKNOWLEDGED"
                          ? "bg-emerald-500 animate-ping"
                          : "bg-rose-500 animate-ping"
                      }`}
                    />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Interactive Live Widget
                    </span>
                  </div>

                  {/* Unique Feature: Quick Camouflage Toggle */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setDisguiseMode(!disguiseMode)}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border transition ${
                        disguiseMode
                          ? "bg-amber-50 border-amber-300 text-amber-800"
                          : "bg-stone-100 border-stone-200 text-slate-600 hover:text-slate-900"
                      }`}
                      title="See how the app disguises itself if someone looks at your screen"
                    >
                      <CloudSun className="h-3.5 w-3.5 text-amber-500" />
                      {disguiseMode ? "Exit Disguise" : "Try Covert Disguise"}
                    </button>
                    {simState !== "IDLE" && (
                      <button
                        type="button"
                        onClick={resetDemo}
                        aria-label="Reset Simulator"
                        className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-slate-600 transition"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* CAMOUFLAGE MODE OVERLAY (Looks like a calm Daily Weather & Air Quality Card) */}
                {disguiseMode ? (
                  <div className="py-6 px-2 space-y-5 text-slate-800">
                    <div className="flex items-center justify-between bg-sky-50/80 border border-sky-100 rounded-2xl p-4">
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-700">
                          Local Atmosphere • Calm View
                        </span>
                        <div className="text-3xl font-extrabold text-slate-900 mt-1">
                          24°C • Pleasant Breeze
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Air Quality Index: 38 (Good) • UV Index: Low
                        </div>
                      </div>
                      <CloudSun className="h-12 w-12 text-amber-400 shrink-0" />
                    </div>

                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                      <div className="text-xs font-bold text-slate-700">
                        Daily Mindfulness Note
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        &ldquo;Take a slow breath. Even while this calm weather
                        card is visible on screen, your background SOS status is{" "}
                        <strong className="text-teal-700">{simState}</strong>.&rdquo;
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          if (simState === "IDLE") runDemoLifecycle();
                        }}
                        className="mt-2 w-full py-2.5 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-slate-700 hover:bg-stone-100 transition"
                      >
                        {simState === "IDLE"
                          ? "Tap Here to Trigger Hidden SOS Behind Disguise"
                          : `Hidden Alert Status: ${simState} (Active)`}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* STANDARD DAYLIGHT TACTILE SOS PAD */
                  <>
                    {/* Status Pill Bar */}
                    <div className="flex items-center justify-between bg-stone-50 border border-stone-200/80 rounded-2xl px-4 py-2.5 mb-4 text-xs">
                      <span className="text-slate-500 font-medium">
                        Current Alert State
                      </span>
                      <span
                        className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                          simState === "IDLE"
                            ? "bg-teal-50 text-teal-800 border border-teal-200"
                            : simState === "ACKNOWLEDGED"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-rose-100 text-rose-800 border border-rose-300"
                        }`}
                      >
                        {simState === "IDLE" ? "STANDBY • READY" : simState}
                      </span>
                    </div>

                    {/* Tactile Neumorphic Hold Button */}
                    <div className="py-3 flex flex-col items-center justify-center relative">
                      <div className="relative flex items-center justify-center">
                        {simState !== "IDLE" && (
                          <div
                            className={`absolute h-48 w-48 rounded-full animate-ripple-soft pointer-events-none ${
                              simState === "ACKNOWLEDGED"
                                ? "bg-emerald-400/20 border border-emerald-400"
                                : "bg-rose-400/20 border border-rose-400"
                            }`}
                          />
                        )}

                        <svg
                          className="w-48 h-48 -rotate-90 transform"
                          viewBox="0 0 180 180"
                        >
                          <circle
                            cx="90"
                            cy="90"
                            r={radius}
                            stroke="#F1F5F9"
                            strokeWidth="10"
                            fill="transparent"
                          />
                          <circle
                            cx="90"
                            cy="90"
                            r={radius}
                            stroke={
                              simState === "ACKNOWLEDGED"
                                ? "#0D9488"
                                : "#E11D48"
                            }
                            strokeWidth="10"
                            strokeDasharray={circumference}
                            strokeDashoffset={
                              simState === "IDLE" || simState === "HOLDING"
                                ? strokeDashoffset
                                : 0
                            }
                            strokeLinecap="round"
                            fill="transparent"
                            className="transition-all duration-75"
                          />
                        </svg>

                        <button
                          type="button"
                          onMouseDown={startDemoHold}
                          onMouseUp={cancelDemoHold}
                          onMouseLeave={cancelDemoHold}
                          onTouchStart={startDemoHold}
                          onTouchEnd={cancelDemoHold}
                          onClick={() => {
                            if (simState === "IDLE") runDemoLifecycle();
                          }}
                          aria-label="Press and hold to test silent emergency trigger"
                          className="absolute h-36 w-36 rounded-full bg-gradient-to-b from-white to-stone-50 hover:from-rose-50/40 hover:to-white shadow-sos-pad flex flex-col items-center justify-center select-none focus:outline-none focus:ring-4 focus:ring-rose-500/20 transition group"
                        >
                          {simState === "IDLE" && (
                            <>
                              <div className="h-11 w-11 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 group-hover:scale-105 transition">
                                <Fingerprint className="h-6 w-6" />
                              </div>
                              <span className="text-xs font-extrabold text-slate-900 mt-2 tracking-tight">
                                HOLD FOR SOS
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium">
                                Press & hold (or tap)
                              </span>
                            </>
                          )}

                          {simState === "HOLDING" && (
                            <>
                              <ShieldAlert className="h-7 w-7 text-rose-600 animate-pulse" />
                              <span className="text-base font-extrabold text-rose-600 mt-1">
                                {holdProgress}%
                              </span>
                              <span className="text-[10px] text-slate-500">
                                Release to cancel
                              </span>
                            </>
                          )}

                          {simState === "ACQUIRING_GPS" && (
                            <>
                              <Navigation className="h-7 w-7 text-teal-600 animate-bounce" />
                              <span className="text-xs font-extrabold text-slate-900 mt-1.5">
                                LOCKING GPS
                              </span>
                              <span className="text-[10px] text-slate-500">
                                ±11m precision
                              </span>
                            </>
                          )}

                          {simState === "DISPATCHED" && (
                            <>
                              <Radio className="h-7 w-7 text-rose-600 animate-pulse" />
                              <span className="text-xs font-extrabold text-slate-900 mt-1.5">
                                ALERT SENT
                              </span>
                              <span className="text-[10px] text-rose-600 font-semibold">
                                Notifying circle...
                              </span>
                            </>
                          )}

                          {simState === "ACKNOWLEDGED" && (
                            <>
                              <CheckCircle2 className="h-8 w-8 text-teal-600" />
                              <span className="text-xs font-extrabold text-teal-800 mt-1">
                                CONFIRMED
                              </span>
                              <span className="text-[10px] text-teal-600 font-semibold">
                                Rohan saw your alert
                              </span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-xs text-slate-500 mt-3 text-center max-w-xs">
                        {simState === "IDLE"
                          ? "Try pressing & holding the tactile circle above to see how a silent alert dispatches."
                          : simState === "HOLDING"
                          ? "Keep holding... releasing early cancels with zero messages sent."
                          : simState === "ACQUIRING_GPS"
                          ? "Capturing permission-based GPS coordinates..."
                          : simState === "DISPATCHED"
                          ? "Dispatched SMS & Email with live responder map link."
                          : "Rohan Sharma acknowledged your alert! Help is on the way."}
                      </p>
                    </div>
                  </>
                )}

                {/* Bottom Clean Live Receipt Card */}
                <div className="mt-4 rounded-2xl bg-stone-50 border border-stone-200/90 p-4 text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-500 font-semibold border-b border-stone-200/80 pb-2">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <VolumeX className="h-3.5 w-3.5 text-teal-700" />
                      Silent Telemetry Receipt
                    </span>
                    <span className="text-[11px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                      0dB Stealth
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">
                        Location Precision
                      </span>
                      <span className="font-semibold text-slate-800">
                        {simState === "IDLE" || simState === "HOLDING"
                          ? "Standby (Permission Ready)"
                          : "21.0952° N, 79.0988° E (±11m)"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">
                        Trusted Circle Status
                      </span>
                      <span className="font-semibold text-teal-700">
                        {simState === "ACKNOWLEDGED"
                          ? "Acknowledged by Rohan"
                          : simState === "DISPATCHED"
                          ? "2 Contacts Notified"
                          : "2 Contacts Ready"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            DAYLIGHT BENTO GRID: WHY THIS DESIGN PROTECTS BETTER
        ========================================================== */}
        <section
          id="features"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-stone-200/80"
        >
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
              Thoughtful Safety Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
              Designed to keep you calm—and keep your screen inconspicuous.
            </h2>
            <p className="text-base text-slate-600 mt-2">
              Every visual and backend decision prioritizes speed, emotional
              clarity, and honest status reporting without alarming onlookers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Card 1: Non-Alarming Visual Camouflage (7 cols) */}
            <div className="md:col-span-7 rounded-3xl bg-white border border-stone-200/90 p-7 sm:p-8 shadow-tactile flex flex-col justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
                  <EyeOff className="h-3.5 w-3.5 text-teal-600" />
                  Low-Profile Daylight Interface
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Doesn&apos;t scream &ldquo;Emergency App&rdquo; to someone
                  standing next to you.
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Traditional SOS apps use flashing red sirens and pitch-black
                  screens that immediately draw eyes in a crowded train, cab, or
                  living room. Our warm stone and botanical teal interface looks
                  indistinguishable from a calm daily planner or weather widget.
                </p>
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Zero Audio • Zero Flash • Zero Popups
                    </div>
                    <div className="text-xs text-slate-500">
                      Safe to trigger while holding your phone naturally at your
                      side
                    </div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-teal-800 bg-teal-100/80 px-3 py-1 rounded-full shrink-0">
                  Always Silent
                </span>
              </div>
            </div>

            {/* Card 2: Honest Delivery Receipts (5 cols) */}
            <div className="md:col-span-5 rounded-3xl bg-white border border-stone-200/90 p-7 sm:p-8 shadow-tactile flex flex-col justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
                  <BellRing className="h-3.5 w-3.5 text-rose-600" />
                  Real Server Verification
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Honest SMS & Email Delivery Tracking
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  We never claim an alert was sent just because you tapped a
                  button. Every SMS and email attempt is verified by the server
                  and displayed with its real delivery status.
                </p>
              </div>

              <div className="mt-6 space-y-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Rohan Sharma (Sibling)
                    </span>
                    <span className="text-slate-500">
                      SMS • +15550199001
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center gap-1">
                    <Check className="h-3 w-3" /> Delivered
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Priya Nair (Roommate)
                    </span>
                    <span className="text-slate-500">
                      Email • priya@example.com
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center gap-1">
                    <Check className="h-3 w-3" /> Delivered
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3: Permission-Based Live GPS (4 cols) */}
            <div className="md:col-span-4 rounded-3xl bg-white border border-stone-200/90 p-6 shadow-tactile space-y-2.5">
              <div className="h-10 w-10 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Resilient GPS Fallback
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Streams live coordinates while your alert is active—and still
                dispatches your emergency message even if browser GPS permission
                is blocked.
              </p>
            </div>

            {/* Card 4: Panic-Tap Deduplication (4 cols) */}
            <div className="md:col-span-4 rounded-3xl bg-white border border-stone-200/90 p-6 shadow-tactile space-y-2.5">
              <div className="h-10 w-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Duplicate-Click Guard
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Repeatedly pressing the SOS button in a stressful moment
                won&apos;t flood your contacts with 20 separate texts. One clean
                live alert link stays updated.
              </p>
            </div>

            {/* Card 5: 192-bit Revocable Links (4 cols) */}
            <div className="md:col-span-4 rounded-3xl bg-white border border-stone-200/90 p-6 shadow-tactile space-y-2.5">
              <div className="h-10 w-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                <KeyRound className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                No App Needed for Contacts
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Your trusted contacts open a secure web link to see your map and
                acknowledge receipt—and the link expires automatically once you
                mark yourself safe.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================
            INTERACTIVE 4-STEP JOURNEY EXPLORER
        ========================================================== */}
        <section
          id="how-it-works"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-stone-200/80"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
                Simple, Transparent Workflow
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                How Silent SOS protects you from start to finish.
              </h2>
              <p className="text-sm text-slate-600 pb-2">
                Click any step below to preview what happens on your device and
                what your trusted contacts receive.
              </p>

              <div className="space-y-3">
                {WORKFLOW_STEPS.map((step, index) => {
                  const active = activeStep === index;
                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => setActiveStep(index)}
                      className={`w-full text-left p-4 rounded-2xl border transition flex items-start justify-between gap-4 ${
                        active
                          ? "bg-white border-teal-600 shadow-md"
                          : "bg-white/60 border-stone-200 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <span
                          className={`text-xs font-extrabold px-2.5 py-1 rounded-lg ${
                            active
                              ? "bg-teal-700 text-white"
                              : "bg-stone-200 text-slate-700"
                          }`}
                        >
                          {step.id}
                        </span>
                        <div>
                          <div className="text-sm font-bold text-slate-900">
                            {step.title}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {step.highlight}
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full shrink-0">
                        {step.timeTag}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Interactive Preview Card */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl bg-white border border-stone-200 p-7 sm:p-8 shadow-tactile space-y-6">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                      {WORKFLOW_STEPS[activeStep].badge}
                    </span>
                    <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                      {WORKFLOW_STEPS[activeStep].title}
                    </h3>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-stone-100 text-slate-700">
                    {WORKFLOW_STEPS[activeStep].timeTag}
                  </span>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {WORKFLOW_STEPS[activeStep].description}
                </p>

                <div className="rounded-2xl bg-[#FAF8F5] border border-stone-200/90 p-5 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {WORKFLOW_STEPS[activeStep].previewTitle}
                  </div>
                  <div className="space-y-2.5">
                    {WORKFLOW_STEPS[activeStep].previewItems.map((item) => (
                      <div
                        key={item.name}
                        className="p-3.5 rounded-xl bg-white border border-stone-200/90 flex items-center justify-between text-xs shadow-sm"
                      >
                        <div>
                          <div className="font-bold text-slate-900">
                            {item.name}
                          </div>
                          <div className="text-slate-500">{item.role}</div>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 font-semibold">
                            {item.status}
                          </span>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {item.channel}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lifecycle Progress Bar */}
                <div className="pt-2">
                  <div className="text-xs font-semibold text-slate-500 mb-2">
                    Verified Alert Lifecycle State Machine:
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
                    {[
                      "CREATED",
                      "PROCESSING",
                      "SENT",
                      "ACKNOWLEDGED",
                      "RESOLVED",
                    ].map((st, idx) => (
                      <React.Fragment key={st}>
                        <span
                          className={`px-2.5 py-1 rounded-lg border ${
                            idx === activeStep || (activeStep === 3 && idx === 3)
                              ? "bg-teal-700 border-teal-700 text-white"
                              : "bg-stone-100 border-stone-200 text-slate-500"
                          }`}
                        >
                          {st}
                        </span>
                        {idx < 4 && <span className="text-stone-400">→</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            FAQ ACCORDION SECTION
        ========================================================== */}
        <section
          id="faq"
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-stone-200/80"
        >
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-700">
              Clarity & Honesty
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((item, idx) => {
              const open = openFaq === idx;
              return (
                <div
                  key={item.q}
                  className="rounded-2xl bg-white border border-stone-200/90 shadow-sm overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : idx)}
                    aria-expanded={open}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 text-sm font-bold text-slate-900 hover:bg-stone-50 transition"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-500 shrink-0 transition-transform ${
                        open ? "rotate-180 text-teal-700" : ""
                      }`}
                    />
                  </button>
                  {open && (
                    <div className="px-6 pb-5 pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-stone-100">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================
            WARM BOTANICAL CALL TO ACTION BANNER
        ========================================================== */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="rounded-[32px] bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 text-white p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-2.5 max-w-xl">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-teal-200 bg-teal-950/60 border border-teal-700 px-3 py-1 rounded-full">
                <HeartHandshake className="h-3.5 w-3.5" /> Ready in Under a Minute
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold">
                Build your personal safety circle today.
              </h2>
              <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
                Register your profile, add your trusted contacts, and test the
                complete silent SOS workflow in safe sandbox mode.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/register"
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-100 text-slate-900 font-bold text-xs sm:text-sm transition shadow-md flex items-center gap-2"
              >
                Get Started Free <ArrowRight className="h-4 w-4 text-teal-700" />
              </Link>
              <Link
                href="/login"
                className="px-5 py-3.5 rounded-2xl bg-teal-950/60 hover:bg-teal-950 text-white border border-teal-600 font-semibold text-xs sm:text-sm transition"
              >
                Sign In to Demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Daylight Footer */}
      <footer className="relative z-10 border-t border-stone-200 bg-white py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <HeartHandshake className="h-4 w-4 text-teal-700" />
              <span className="font-extrabold text-slate-900 text-sm">
                Silent<span className="text-rose-600">SOS</span>
              </span>
              <span>•</span>
              <span>Unified Mentor Internship Project 02</span>
            </div>
            <p className="text-slate-500">
              Designed with a calm Nordic Daylight palette for discreet personal
              safety and verified emergency telemetry.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 font-medium text-slate-600">
            <Link href="/dashboard" className="hover:text-teal-700">
              SOS Console
            </Link>
            <Link href="/contacts" className="hover:text-teal-700">
              Trusted Contacts
            </Link>
            <Link href="/history" className="hover:text-teal-700">
              Alert History
            </Link>
            <Link href="/privacy" className="hover:text-teal-700">
              Privacy & GPS
            </Link>
            <Link href="/admin" className="hover:text-teal-700">
              Admin Monitor
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}