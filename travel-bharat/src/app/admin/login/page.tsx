"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, KeyRound, Mail, ArrowRight, Shield, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (email === "admin@travelbharat.gov.in" && password === "bharat2026") {
      document.cookie = "travelbharat_session=authenticated; path=/; max-age=86400; SameSite=Lax";
      router.push("/admin/dashboard");
      router.refresh();
    } else {
      setError("Unauthorized access token or invalid administrative credentials.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0D0D0C] text-[#F5F4F0] relative overflow-hidden flex flex-col justify-between p-6 sm:p-12 font-sans selection:bg-[#D35234] selection:text-white">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#D35234]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-50" />

      {/* Top Bar */}
      <header className="relative z-10 flex items-center justify-between max-w-6xl w-full mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all font-mono text-[11px] uppercase tracking-[0.2em] shadow-xl"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Atlas
        </Link>
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-[#E8956F]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Encrypted Node
        </div>
      </header>

      {/* Login Portal Card */}
      <div className="relative z-10 w-full max-w-lg mx-auto my-12 bg-white/[0.02] border border-white/10 rounded-[3rem] p-8 sm:p-14 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#D35234] flex items-center justify-center shadow-lg shadow-[#D35234]/30">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-[0.2em] text-white/50">
            Console v2.4
          </span>
        </div>

        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#D35234] font-bold mb-2">
          TravelBharat Internal Core
        </p>
        <h1 className="text-4xl sm:text-5xl font-serif font-light text-white leading-tight mb-3">
          Curator Access<span className="text-[#D35234]">.</span>
        </h1>
        <p className="text-white/50 text-sm font-medium leading-relaxed mb-8">
          Authenticate session credentials to manage geographical records, state dossiers, and catalogued monuments.
        </p>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="block font-mono text-[10px] uppercase tracking-widest text-white/50">
              Admin Identity
            </label>
            <div className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus-within:border-[#D35234] focus-within:bg-white/[0.07] transition-all">
              <Mail className="w-4 h-4 text-white/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@travelbharat.gov.in"
                className="w-full bg-transparent text-sm text-white placeholder:text-white/20 outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-mono text-[10px] uppercase tracking-widest text-white/50">
              Access Passphrase
            </label>
            <div className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus-within:border-[#D35234] focus-within:bg-white/[0.07] transition-all">
              <KeyRound className="w-4 h-4 text-white/40" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-transparent text-sm text-white placeholder:text-white/20 outline-none font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-4 rounded-2xl bg-[#D35234] hover:bg-[#b84227] text-white text-xs font-bold uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-[#D35234]/25 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Authenticating Node..." : "Enter Repository"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-white/40">
          <span>Root User</span>
          <span className="text-white/70">admin@travelbharat.gov.in / bharat2026</span>
        </div>
      </div>

      {/* Footer System Meta */}
      <footer className="relative z-10 text-center font-mono text-[10px] text-white/25 uppercase tracking-widest">
        National Cultural Archive Protocol • ISO/IEC 27001 Authenticated
      </footer>
    </main>
  );
}