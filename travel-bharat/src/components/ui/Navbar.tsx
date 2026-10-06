"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  Compass,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  MapPin,
  Calendar,
  Landmark,
  Mountain,
  Palmtree,
  Flame,
  ArrowRight,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Scroll detection for glassmorphism transformation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setActiveDropdown(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const regions = [
    { name: "North India", states: "Rajasthan, Himachal, Uttarakhand, J&K", href: "#explorer" },
    { name: "South India", states: "Kerala, Karnataka, Tamil Nadu, Telangana", href: "#explorer" },
    { name: "West India", states: "Maharashtra, Goa, Gujarat", href: "#explorer" },
    { name: "Northeast India", states: "Meghalaya, Assam, Sikkim, Nagaland", href: "#explorer" },
  ];

  const experiences = [
    { title: "Living Heritage", desc: "Forts, palaces & ancient caves", icon: Landmark, color: "text-[#F4C430]" },
    { title: "High Himalayan", desc: "Passes, valleys & monastery trails", icon: Mountain, color: "text-sky-400" },
    { title: "Sacred Shrines", desc: "Ghats, jyotirlingas & river rituals", icon: Flame, color: "text-[#E2725B]" },
    { title: "Coastal & Tropics", desc: "Backwaters, spice routes & lagoons", icon: Palmtree, color: "text-emerald-400" },
  ];

  const quickSearchPicks = [
    { name: "Varanasi Ghats", state: "Uttar Pradesh", slug: "varanasi-ghats" },
    { name: "Hampi Monuments", state: "Karnataka", slug: "hampi-monuments" },
    { name: "Munnar Hills", state: "Kerala", slug: "munnar-plantations" },
    { name: "Pangong Tso", state: "Ladakh", slug: "pangong-tso" },
    { name: "Mehrangarh Fort", state: "Rajasthan", slug: "mehrangarh-fort" },
  ];

  const filteredPicks = quickSearchPicks.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "py-3 bg-black/85 backdrop-blur-2xl border-b border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.7)]"
            : "py-5 bg-gradient-to-b from-black/90 via-black/40 to-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* 1. BRAND LOGO (Left) */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#F4C430] via-amber-300 to-[#E2725B] p-[1.5px] transition-transform duration-300 group-hover:scale-105 shadow-md shadow-[#F4C430]/20">
                <div className="w-full h-full bg-[#111111] rounded-[14px] flex items-center justify-center">
                  <span className="font-serif text-xl font-bold text-[#F4C430]">भ</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-serif font-medium tracking-wider text-white group-hover:text-[#F4C430] transition-colors leading-none">
                  TravelBharat
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#F4C430]/90 font-medium mt-1">
                  Discover India
                </span>
              </div>
            </Link>

            {/* 2. CENTER NAVIGATION PILL (Desktop) */}
            <nav
              ref={dropdownRef}
              className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-xl shadow-inner relative"
            >
              {/* Destinations Link */}
              <Link
                href="#destinations"
                className="px-4 py-2 text-xs uppercase tracking-widest text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all font-medium"
              >
                Destinations
              </Link>

              

              {/* State Matrix Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === "regions" ? null : "regions")}
                  className={`flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-widest rounded-full transition-all font-medium cursor-pointer ${
                    activeDropdown === "regions"
                      ? "bg-[#F4C430] text-black font-semibold shadow-sm"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span>States & UTs</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === "regions" ? "rotate-180 text-black" : "text-white/60"
                    }`}
                  />
                </button>

                {/* Dropdown Menu: Regions */}
                {activeDropdown === "regions" && (
                  <div className="absolute top-full left-0 mt-3 w-80 p-3 rounded-2xl bg-[#141414] border border-white/15 backdrop-blur-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                    <p className="text-[10px] uppercase tracking-widest text-[#F4C430] px-3 py-2 font-semibold border-b border-white/10">
                      Geographic Zones
                    </p>
                    <div className="mt-1 space-y-1">
                      {regions.map((reg) => (
                        <Link
                          key={reg.name}
                          href={reg.href}
                          onClick={() => setActiveDropdown(null)}
                          className="block p-3 rounded-xl hover:bg-white/10 transition-colors group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-white group-hover:text-[#F4C430]">
                              {reg.name}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-[#F4C430] group-hover:translate-x-1 transition-all" />
                          </div>
                          <p className="text-[11px] text-white/50 mt-0.5 line-clamp-1">{reg.states}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Experiences Dropdown */}
              <div className="relative">
                <button
                  onClick={() =>
                    setActiveDropdown(activeDropdown === "experiences" ? null : "experiences")
                  }
                  className={`flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-widest rounded-full transition-all font-medium cursor-pointer ${
                    activeDropdown === "experiences"
                      ? "bg-[#F4C430] text-black font-semibold shadow-sm"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span>Experiences</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === "experiences" ? "rotate-180 text-black" : "text-white/60"
                    }`}
                  />
                </button>

                {/* Dropdown Menu: Experiences */}
                {activeDropdown === "experiences" && (
                  <div className="absolute top-full -left-20 mt-3 w-88 p-3 rounded-2xl bg-[#141414] border border-white/15 backdrop-blur-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                    <p className="text-[10px] uppercase tracking-widest text-[#F4C430] px-3 py-2 font-semibold border-b border-white/10">
                      Curated Journeys
                    </p>
                    <div className="mt-1 space-y-1">
                      {experiences.map((exp) => {
                        const Icon = exp.icon;
                        return (
                          <Link
                            key={exp.title}
                            href="#destinations"
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors group"
                          >
                            <div className={`p-2 rounded-lg bg-white/5 ${exp.color} shrink-0`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-white group-hover:text-[#F4C430]">
                                {exp.title}
                              </p>
                              <p className="text-[11px] text-white/50 mt-0.5">{exp.desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Seasons & UNESCO Direct Links */}
              <Link
                href="#seasons"
                className="px-4 py-2 text-xs uppercase tracking-widest text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all font-medium"
              >
                Radar
              </Link>
              <Link
                href="#unesco"
                className="px-4 py-2 text-xs uppercase tracking-widest text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all font-medium"
              >
                UNESCO
              </Link>

              <Link href="/interactive-map" className={`px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] font-bold rounded-full transition-colors ${isScrolled ? "text-[#1C1C1C]/70 hover:text-[#1C1C1C] hover:bg-[#F5F4F0]" : "text-white/80 hover:text-white hover:bg-white/10"}`}>
  Interactive Map
</Link>

            </nav>

            {/* 3. RIGHT CONTROLS & SEARCH (Right) */}
            <div className="flex items-center gap-2.5">
              {/* Search Trigger Button with Keyboard Shortcut */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white/80 hover:text-white transition-all cursor-pointer shadow-sm group"
                title="Search destinations (Cmd + K)"
              >
                <Search className="w-3.5 h-3.5 text-[#F4C430] group-hover:scale-110 transition-transform" />
                <span className="hidden xl:inline text-xs font-light text-white/70">Search index...</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono text-white/50 bg-white/10 rounded border border-white/10">
                  ⌘K
                </kbd>
              </button>

              {/* Action Portal Button */}
              <Link
                href="/admin/login"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F4C430] hover:bg-[#D4A820] text-black text-xs uppercase tracking-wider font-semibold transition-all shadow-md shadow-[#F4C430]/20"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-black" />
                <span>Admin</span>
              </Link>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-2xl bg-white/10 text-white lg:hidden hover:bg-white/20 transition-colors"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* MOBILE SLIDE-OUT MENU */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 mx-4 p-5 rounded-3xl bg-[#121212]/95 border border-white/15 backdrop-blur-3xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="space-y-1">
              <Link
                href="#destinations"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl text-white/80 hover:text-white hover:bg-white/5 text-sm uppercase tracking-wider font-medium"
              >
                <span>Destinations</span>
                <ArrowRight className="w-4 h-4 text-white/30" />
              </Link>
              <Link
                href="#explorer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl text-white/80 hover:text-white hover:bg-white/5 text-sm uppercase tracking-wider font-medium"
              >
                <span>States & UT Directory</span>
                <ArrowRight className="w-4 h-4 text-white/30" />
              </Link>
              <Link
                href="#seasons"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl text-white/80 hover:text-white hover:bg-white/5 text-sm uppercase tracking-wider font-medium"
              >
                <span>Seasonal Travel Radar</span>
                <ArrowRight className="w-4 h-4 text-white/30" />
              </Link>
              <Link
                href="#unesco"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl text-white/80 hover:text-white hover:bg-white/5 text-sm uppercase tracking-wider font-medium"
              >
                <span>UNESCO World Heritage</span>
                <ArrowRight className="w-4 h-4 text-white/30" />
              </Link>
            </div>

            <div className="pt-4 mt-3 border-t border-white/10 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 text-white text-xs uppercase tracking-wider font-semibold"
              >
                <Search className="w-4 h-4 text-[#F4C430]" />
                <span>Search All 500+ Sites</span>
              </button>
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-xl bg-[#F4C430] text-black text-xs uppercase tracking-wider font-semibold shadow-md"
              >
                Admin Management Portal
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* QUICK COMMAND SEARCH MODAL */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-[#141414] border border-white/20 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F4C430]" />
                <span className="text-xs uppercase tracking-[0.2em] text-[#F4C430] font-semibold">
                  TravelBharat Index Search
                </span>
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-full text-white/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Input Field */}
            <div className="mt-4 flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/15 rounded-2xl focus-within:border-[#F4C430]/60 transition-colors">
              <Search className="w-5 h-5 text-[#F4C430] shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type a state, monument, or region (e.g. Hampi, Ladakh)..."
                className="w-full bg-transparent text-white placeholder:text-white/40 outline-none text-sm font-light"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-white/40 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Live Search Suggestions */}
            <div className="mt-5 max-h-64 overflow-y-auto space-y-1 pr-1">
              <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2 px-1">
                {searchQuery ? "Matching Results" : "Trending Destinations"}
              </p>
              {filteredPicks.length > 0 ? (
                filteredPicks.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/destinations/${item.slug}`}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-[#F4C430]/30 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-black/40 text-[#F4C430]">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white group-hover:text-[#F4C430] transition-colors">
                          {item.name}
                        </p>
                        <p className="text-xs text-white/50">{item.state}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-[#F4C430] group-hover:translate-x-1 transition-all" />
                  </Link>
                ))
              ) : (
                <div className="py-8 text-center text-white/40 text-xs">
                  No destinations found matching &ldquo;{searchQuery}&rdquo;.
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40">
              <span>Press <kbd className="font-mono text-white/70">ESC</kbd> to exit</span>
              <span>28 States • 8 UTs Loaded</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}