"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, X, ArrowUpRight } from "lucide-react";

export function LuxuryNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isScrolled ? "py-4" : "py-8"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div
          className={`flex items-center justify-between px-6 py-4 mx-auto transition-all duration-500 rounded-[2rem] ${
            isScrolled
              ? "bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5"
              : "bg-transparent"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-[#D35234] flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-white font-serif font-bold text-sm">भ</span>
            </div>
            <span className={`font-serif text-xl tracking-tight transition-colors ${isScrolled ? "text-black" : "text-white"}`}>
              TravelBharat.
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {["Destinations", "The Atlas", "Seasons", "UNESCO"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className={`text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:text-[#D35234] ${
                  isScrolled ? "text-black/60" : "text-white/80"
                }`}
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className={`p-2 rounded-full transition-colors ${isScrolled ? "text-black hover:bg-black/5" : "text-white hover:bg-white/10"}`}>
              <Search className="w-5 h-5" />
            </button>
            <Link
              href="/admin/login"
              className={`hidden md:flex items-center gap-1 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                isScrolled
                  ? "bg-black text-white hover:bg-[#D35234]"
                  : "bg-white text-black hover:bg-[#D35234] hover:text-white"
              }`}
            >
              Admin <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}