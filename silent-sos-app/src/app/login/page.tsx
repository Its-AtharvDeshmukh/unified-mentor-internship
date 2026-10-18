"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, Lock, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Sign in failed.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Network error. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(type: "user" | "admin") {
    if (type === "user") {
      setEmail("demo@silentsos.example");
      setPassword("SafetyFirst#2026");
    } else {
      setEmail("admin@silentsos.example");
      setPassword("AdminMonitor#2026");
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-obsidian">
      <div className="w-full max-w-md bg-charcoal border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <span className="font-bold text-white">
              Silent<span className="text-rose-500">SOS</span>
            </span>
          </Link>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Lock className="h-3.5 w-3.5" /> Encrypted Session
          </span>
        </div>

        <h1 className="text-2xl font-bold text-white">Sign in to Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">
          Access your silent SOS trigger and trusted contact network.
        </p>

        {error && (
          <div
            role="alert"
            className="mt-4 p-3 rounded-lg bg-rose-950/60 border border-rose-700 text-rose-200 text-xs flex items-center gap-2"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-slate-300 mb-1.5"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-slate-300 mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="••••••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold text-sm transition"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Quick Sandbox Demo Helpers */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <p className="text-xs text-slate-400 mb-2.5">
            Sandbox Evaluation Accounts (from <code className="text-slate-200">npm run db:seed</code>):
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemo("user")}
              className="text-xs py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition"
            >
              Fill Demo User
            </button>
            <button
              type="button"
              onClick={() => fillDemo("admin")}
              className="text-xs py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition"
            >
              Fill Demo Admin
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          New to Silent SOS?{" "}
          <Link
            href="/register"
            className="text-rose-400 hover:underline font-medium"
          >
            Create a safety profile
          </Link>
        </p>
      </div>
    </div>
  );
}

