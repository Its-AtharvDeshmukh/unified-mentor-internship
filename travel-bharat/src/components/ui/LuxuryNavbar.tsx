"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Menu, 
  X, 
  ArrowUpRight, 
  Sparkles, 
  MapPin, 
  ArrowRight,
  Command
} from "lucide-react";

const INDEX_LOOKUP = [
  { name: "Taj Mahal Complex", state: "Uttar Pradesh", slug: "taj-mahal", tag: "UNESCO Heritage" },
  { name: "Sun Temple Konark", state: "Odisha", slug: "konark-sun-temple", tag: "Solar Chariot" },
  { name: "Hampi Monuments", state: "Karnataka", slug: "hampi-monuments", tag: "Vijayanagara" },
  { name: "Kaziranga Grasslands", state: "Assam", slug: "kaziranga-national-park", tag: "Wildlife" },
  { name: "Varanasi Ghats", state: "Uttar Pradesh", slug: "varanasi-ghats", tag: "Sacred River" },
  { name: "Mehrangarh Fort", state: "Rajasthan", slug: "mehrangarh-fort", tag: "Citadel" },
  { name: "Pangong Tso Basin", state: "Ladakh", slug: "pangong-tso", tag: "High-Altitude" },
  { name: "Munnar Hills", state: "Kerala", slug: "munnar-plantations", tag: "Western Ghats" },
];

export function LuxuryNavbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut listener for Cmd+K / Ctrl+K and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchQuery("");
    }
  }, [isSearchOpen]);

  const filteredItems = searchQuery.trim()
    ? INDEX_LOOKUP.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : INDEX_LOOKUP.slice(0, 5);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const navLinks = [
    { label: "Destinations", href: "/#destinations" },
    { label: "The Atlas", href: "/#the-atlas" },
    { label: "Seasons", href: "/#seasons" },
    { label: "UNESCO", href: "/#unesco" },
    { label: "Interactive Map", href: "/interactive-map" },
  ];

  return (
    <>
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
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-[#D35234] flex items-center justify-center transition-transform group-hover:scale-105 shadow-md shadow-[#D35234]/30">
                <span className="text-white font-serif font-bold text-sm">भ</span>
              </div>
              <span
                className={`font-serif text-xl tracking-tight transition-colors ${
                  isScrolled ? "text-black" : "text-white"
                }`}
              >
                TravelBharat.
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:text-[#D35234] ${
                    isScrolled ? "text-black/70" : "text-white/80"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Action Hub */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Open search index"
                className={`p-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer ${
                  isScrolled
                    ? "text-black hover:bg-black/5"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <Search className="w-4 h-4 text-[#D35234]" />
                <span className="hidden xl:inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-black/40">
                  <kbd className="px-1.5 py-0.5 rounded bg-black/5 border border-black/10 text-[9px]">⌘K</kbd>
                </span>
              </button>

              <Link
                href="/admin/login"
                className={`hidden md:flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  isScrolled
                    ? "bg-black text-white hover:bg-[#D35234]"
                    : "bg-white text-black hover:bg-[#D35234] hover:text-white"
                }`}
              >
                Admin <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setIsMobileOpen((prev) => !prev)}
                aria-label="Toggle navigation menu"
                className={`md:hidden p-2.5 rounded-full transition-colors ${
                  isScrolled
                    ? "text-black hover:bg-black/5"
                    : "text-white hover:bg-white/10"
                }`}
              >
                {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Panel */}
          {isMobileOpen && (
            <div className="md:hidden mt-3 p-6 rounded-[2rem] bg-[#0E0D0C]/95 backdrop-blur-2xl border border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => {
                    setIsMobileOpen(false);
                    setIsSearchOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white/10 text-white font-mono text-xs uppercase tracking-widest"
                >
                  <span className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#D35234]" /> Search Directory
                  </span>
                  <span className="text-white/40">Open</span>
                </button>

                {navLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl text-white/80 hover:text-white hover:bg-white/5 text-xs font-mono uppercase tracking-[0.2em] font-medium transition-colors"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-4 h-4 text-white/30" />
                  </Link>
                ))}

                <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-2">
                  <Link
                    href="/admin/login"
                    onClick={() => setIsMobileOpen(false)}
                    className="w-full text-center py-3.5 rounded-xl bg-[#D35234] hover:bg-[#b84227] text-white text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-[#D35234]/30"
                  >
                    Admin Portal Console
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Spotlight Command Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 sm:pt-32 px-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[#141414] border border-white/15 rounded-[2.5rem] p-6 sm:p-8 shadow-[0_20px_70px_rgba(0,0,0,0.8)] text-white">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#E8956F] font-bold">
                <Sparkles className="w-4 h-4 text-[#D35234]" /> Subcontinental Discovery Search
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSearchSubmit} className="mt-6 flex items-center gap-3.5 px-5 py-4 rounded-2xl bg-white/5 border border-white/10 focus-within:border-[#D35234] focus-within:bg-white/[0.08] transition-all">
              <Search className="w-5 h-5 text-[#D35234] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search state, monument, or heritage type (e.g. Hampi, Taj Mahal, Assam)..."
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-white/30 outline-none font-sans"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="font-mono text-xs text-white/40 hover:text-white"
                >
                  Clear
                </button>
              )}
            </form>

            {/* Suggestions & Results List */}
            <div className="mt-6 space-y-2 max-h-72 overflow-y-auto pr-1">
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/40 px-2 mb-3">
                {searchQuery ? "Matching Monuments" : "Curated Quick Access"}
              </p>

              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/destinations/${item.slug}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/10 border border-white/5 hover:border-[#D35234]/40 transition-all group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-[#D35234]">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-serif text-base text-white group-hover:text-[#E8956F] transition-colors leading-snug">
                          {item.name}
                        </p>
                        <p className="font-mono text-[11px] text-white/50">{item.state}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="hidden sm:inline font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/5 text-white/60">
                        {item.tag}
                      </span>
                      <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-[#D35234] group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-12 text-center text-white/40 font-mono text-xs">
                  No records indexed for &ldquo;{searchQuery}&rdquo;. Press Enter to perform a broader database scan.
                </div>
              )}
            </div>

            {/* Footer Commands */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between font-mono text-[10px] text-white/40 uppercase tracking-widest">
              <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/70">ESC</kbd> to dismiss</span>
              <span>Hit <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/70">↵ ENTER</kbd> for deep scan</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
}