"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, AlertCircle, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed.");
      } else {
        router.push("/contacts?onboarding=1");
        router.refresh();
      }
    } catch {
      setError("Network error while creating account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-10 bg-obsidian">
      <div className="w-full max-w-md bg-charcoal border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        {/* Onboarding Step Indicator */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-6 pb-4 border-b border-slate-800">
          <span className="text-rose-400 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" /> Step 1: Account Setup
          </span>
          <span>Step 2: Trusted Contacts →</span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-lg bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <h1 className="text-xl font-bold text-white">
            Create Safety Profile
          </h1>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Your display name and optional callback number are included only when
          dispatching an authorized emergency alert to your trusted contacts.
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

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-medium text-slate-300 mb-1"
            >
              Full Name (Shown to Emergency Contacts)
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="Ananya Sharma"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-slate-300 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="ananya@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-xs font-medium text-slate-300 mb-1"
            >
              Phone Number (Optional, E.164 format)
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="+15550199001"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-slate-300 mb-1"
            >
              Password (8+ characters)
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="At least 8 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold text-sm transition"
          >
            {loading
              ? "Creating Profile..."
              : "Continue to Trusted Contacts →"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Already registered?{" "}
          <Link
            href="/login"
            className="text-rose-400 hover:underline font-medium"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

