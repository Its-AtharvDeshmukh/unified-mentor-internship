"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, Lock, Mail } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For capstone demonstration: secure credentials check
    if (email === "admin@travelbharat.gov.in" && password === "bharat2026") {
      document.cookie = "travelbharat_session=authenticated; path=/;";
      router.push("/admin/dashboard");
    } else {
      setError("Invalid administrative credentials. Use default demo access.");
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F4F0] text-[#1C1C1C] flex flex-col justify-center items-center px-6 font-sans">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black/60 hover:text-black">
        <ArrowLeft className="w-4 h-4" /> Return to Atlas
      </Link>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-2xl border border-black/5 space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#D35234] text-white flex items-center justify-center mx-auto shadow-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-serif tracking-tight">Admin Portal</h1>
          <p className="text-xs uppercase tracking-[0.2em] text-black/40 font-bold">Secure Management Console</p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-bold text-black/50">Administrative Email</label>
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#F5F4F0] border border-black/10 focus-within:ring-2 ring-[#D35234]/20">
              <Mail className="w-4 h-4 text-black/40" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@travelbharat.gov.in" 
                className="w-full bg-transparent text-sm outline-none font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-bold text-black/50">Secure Passphrase</label>
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#F5F4F0] border border-black/10 focus-within:ring-2 ring-[#D35234]/20">
              <Lock className="w-4 h-4 text-black/40" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••" 
                className="w-full bg-transparent text-sm outline-none font-medium"
              />
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" className="w-full py-4 rounded-2xl bg-[#D35234] text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#b84227] transition-all shadow-lg cursor-pointer">
              Authenticate Session
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-black/5 text-center">
          <p className="text-[11px] text-black/40 font-medium">
            Demo Credentials: <br />
            <code className="text-black font-mono">admin@travelbharat.gov.in</code> / <code className="text-black font-mono">bharat2026</code>
          </p>
        </div>
      </div>
    </main>
  );
}