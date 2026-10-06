"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Fraunces, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import { UNESCOHeritage } from "@/components/home/UNESCOHeritage";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Compass,
  Wind,
  Droplets,
  Sun,
  Umbrella,
  Backpack,
  Activity,
  Thermometer,
  Mountain,
  Landmark,
  Flame,
  Palmtree,
  ShieldCheck,
  Bell,
  Waves,
  Play,
  Pause,
} from "lucide-react";
import { LuxuryNavbar } from "@/components/ui/LuxuryNavbar";

/* ───────────────────────── Fonts ───────────────────────── */
const display = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const body = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

/* ───────────────────────── Data ───────────────────────── */
const HERO_NAV = [
  { label: "The Atlas", href: "#the-atlas" },
  { label: "Heritage", href: "#heritage" },
  { label: "Cinema", href: "#cinema" },
  { label: "Directory", href: "#destinations" },
  { label: "Soundscapes", href: "#soundscapes" },
  { label: "Seasons", href: "#seasons" },
];

const REGIONS = [
  {
    name: "North India",
    meta: "4 States • 68 Sites",
    img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1200",
    cls: "md:col-span-2 lg:col-span-2 lg:row-span-2",
    big: true,
  },
  {
    name: "South India",
    meta: "5 States • 82 Sites",
    img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800",
    cls: "md:col-span-1 lg:col-span-2",
    big: false,
  },
  {
    name: "Northeast",
    meta: "",
    img: "https://images.unsplash.com/photo-1622308644420-a602e1c90554?q=80&w=800",
    cls: "md:col-span-1 lg:col-span-1",
    big: false,
  },
  {
    name: "West India",
    meta: "",
    img: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=800",
    cls: "md:col-span-2 lg:col-span-1",
    big: false,
  },
];

const CRAFTS = [
  {
    id: "01",
    name: "Kanchipuram Mulberry Silk",
    category: "Textile",
    state: "Tamil Nadu",
    giTag: "2005",
    desc: "Handwoven pure mulberry silk with korvai interlocking borders using gold-dipped silver zari threads.",
    location: "Pillayar Palayam",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200",
  },
  {
    id: "02",
    name: "Pashmina & Sozni Needlecraft",
    category: "Textile",
    state: "Jammu & Kashmir",
    giTag: "2008",
    desc: "Handspun Changthangi mountain-goat fleece finished with dense micro-needlepoint embroidery, refined over centuries in the lanes of Downtown Srinagar.",
    location: "Srinagar & Changthang",
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=1200",
  },
  {
    id: "03",
    name: "Thanjavur Relief Painting",
    category: "Art",
    state: "Tamil Nadu",
    giTag: "2007",
    desc: "Gesso relief layered with gold foil and set with semi-precious stones — a regal tradition that flourished under the Maratha court of the 16th century onward.",
    location: "Cauvery Delta Basin",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200",
  },
  {
    id: "04",
    name: "Bidriware Silver Inlay",
    category: "Metalwork",
    state: "Karnataka",
    giTag: "2006",
    desc: "A zinc-copper alloy blackened with soil from the old fort and inlaid with fine silver wire — an aristocratic craft sustained inside Bidar's walled city.",
    location: "Bidar Bastion",
    image: "https://images.unsplash.com/photo-1600100397608-f010f4439c63?q=80&w=1200",
  },
];

const SIGNATURE_VIDEOS = [
  {
    id: "01",
    slug: "varanasi-ghats",
    name: "Varanasi Ghats",
    state: "Uttar Pradesh",
    tag: "Spiritual Sanctum",
    videoUrl:
      "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-temple-in-india-42999-large.mp4",
    poster: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1600",
    desc: "The eternal city of light and living traditions on the sacred Ganga. Witness the rhythmic chants and spiritual fires that have burned for millennia.",
    metrics: { era: "c. 11th Century BC", altitude: "80.71 m", entry: "Free Public Access" },
  },
  {
    id: "02",
    slug: "hampi-monuments",
    name: "Hampi Monuments",
    state: "Karnataka",
    tag: "Monolithic Heritage",
    videoUrl:
      "https://assets.mixkit.co/videos/preview/mixkit-flying-over-an-ancient-temple-in-a-forest-43003-large.mp4",
    poster: "https://images.unsplash.com/photo-1600100397608-f010f4439c63?q=80&w=1600",
    desc: "A forgotten empire carved in golden granite across the Deccan. Cycle through ancient chariot shrines and royal elephant stables.",
    metrics: { era: "14th Century AD", altitude: "467 m", entry: "ASI Protected Site" },
  },
  {
    id: "03",
    slug: "pangong-tso",
    name: "Pangong Basin",
    state: "Ladakh",
    tag: "Trans-Himalayan Adventure",
    videoUrl:
      "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-mountains-in-a-cold-climate-41484-large.mp4",
    poster: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=1600",
    desc: "A high-altitude marvel of shifting crystalline azure waters, flanked by barren, dramatic ridgelines connecting India and Tibet.",
    metrics: { era: "Geological Wonder", altitude: "4,225 m", entry: "Permit Required" },
  },
  {
    id: "04",
    slug: "munnar-plantations",
    name: "Munnar Hills",
    state: "Kerala",
    tag: "Tropical Shola Forest",
    videoUrl:
      "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-green-mountain-landscape-41482-large.mp4",
    poster: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1600",
    desc: "Emerald tea estates piercing the tropical rainforest clouds. A biodiversity hotspot harboring the endangered Nilgiri Tahr.",
    metrics: { era: "Colonial Era Estates", altitude: "1,532 m", entry: "Eco-Zone Passes" },
  },
];

interface Season {
  title: string;
  months: string;
  icon: LucideIcon;
  color: string;
  bgAccent: string;
  metrics: { temp: string; humidity: string };
  desc: string;
  gear: string;
  places: { name: string; slug: string; img: string; tag: string; state: string }[];
}

const SEASONS: Record<"Winter" | "Monsoon" | "Summer", Season> = {
  Winter: {
    title: "Winter Expeditions",
    months: "November to February",
    icon: Wind,
    color: "text-blue-600",
    bgAccent: "bg-blue-500/10",
    metrics: { temp: "10°C – 24°C", humidity: "Dry 30%" },
    desc: "Crisp air and mild sun. Optimal for navigating the Thar desert, monolithic temples and southern coastal backwaters without the exhaustion of tropical heat.",
    gear: "Light thermals, windcheaters and comfortable walking boots.",
    places: [
      { name: "Jaisalmer Fort", slug: "jaisalmer-citadel", img: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=900", tag: "Desert Frontier", state: "Rajasthan" },
      { name: "Meenakshi Temple", slug: "meenakshi-temple", img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=900", tag: "Dravidian Hub", state: "Tamil Nadu" },
      { name: "Rann of Kutch", slug: "rann-of-kutch", img: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=900", tag: "White Salt Flats", state: "Gujarat" },
    ],
  },
  Monsoon: {
    title: "Monsoon Awakening",
    months: "June to September",
    icon: Umbrella,
    color: "text-emerald-600",
    bgAccent: "bg-emerald-500/10",
    metrics: { temp: "22°C – 28°C", humidity: "Wet 85%" },
    desc: "Thunderous waterfalls and vibrant botanical blooms transform the Western Ghats and Meghalaya into lush, mist-covered paradises.",
    gear: "Waterproof shells, dry bags and anti-slip trekking shoes.",
    places: [
      { name: "Cherrapunji", slug: "cherrapunji", img: "https://images.unsplash.com/photo-1622308644420-a602e1c90554?q=80&w=900", tag: "Living Root Bridges", state: "Meghalaya" },
      { name: "Valley of Flowers", slug: "valley-of-flowers", img: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=900", tag: "Alpine Bloom", state: "Uttarakhand" },
      { name: "Athirappilly", slug: "athirappilly-falls", img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=900", tag: "Rainforest Cascades", state: "Kerala" },
    ],
  },
  Summer: {
    title: "Highland Summers",
    months: "March to May",
    icon: Sun,
    color: "text-[#D35234]",
    bgAccent: "bg-[#D35234]/10",
    metrics: { temp: "5°C – 18°C", humidity: "Crisp 40%" },
    desc: "While the plains heat up, the high-altitude Trans-Himalayan passes and tea ridgelines open up, offering pristine, cool exploration of ancient monasteries.",
    gear: "UV400 sunglasses, SPF 50 sunscreen and high-altitude hydration packs.",
    places: [
      { name: "Spiti Valley", slug: "spiti-valley", img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=900", tag: "Tibetan Plateau", state: "Himachal" },
      { name: "Nubra Dunes", slug: "nubra-valley", img: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=900", tag: "Cold Desert", state: "Ladakh" },
      { name: "Darjeeling", slug: "darjeeling", img: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=900", tag: "Tea Ridgelines", state: "West Bengal" },
    ],
  },
};

type SeasonKey = keyof typeof SEASONS;

const DESTINATIONS = [
  { id: "1", name: "Varanasi Ghats", slug: "varanasi-ghats", city: "Varanasi", state: "Uttar Pradesh", category: "Spiritual", description: "Sacred stone riverfront terraces, ancient Vedic chanting and the evening Ganga Aarti.", bestTime: "Oct – Mar", entryFee: "Free", timings: "24 hours (Aarti 6:30 PM)", image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1200" },
  { id: "2", name: "Hampi Monuments", slug: "hampi-monuments", city: "Vijayanagara", state: "Karnataka", category: "Heritage", description: "Granite monolithic ruins, royal enclosures and stone chariot shrines of the Vijayanagara Empire.", bestTime: "Nov – Feb", entryFee: "₹40 / ₹600 foreign", timings: "6:00 AM – 6:00 PM", image: "https://images.unsplash.com/photo-1600100397608-f010f4439c63?q=80&w=1200" },
  { id: "3", name: "Munnar Tea Hills", slug: "munnar-plantations", city: "Idukki", state: "Kerala", category: "Nature", description: "High mountain plantations, rare flora and cloud-covered valleys across the Western Ghats.", bestTime: "Sep – May", entryFee: "₹125 park entry", timings: "7:00 AM – 4:30 PM", image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1200" },
  { id: "4", name: "Pangong Tso Basin", slug: "pangong-tso", city: "Leh", state: "Ladakh", category: "Adventure", description: "A saline lake at over 4,200 m, shifting through turquoise and cobalt through the day.", bestTime: "Jun – Sep", entryFee: "₹400 permit", timings: "Sunrise – Sunset", image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=1200" },
  { id: "5", name: "Mehrangarh Fort", slug: "mehrangarh-fort", city: "Jodhpur", state: "Rajasthan", category: "Heritage", description: "A towering red sandstone fortress guarding the edge of the historic Blue City.", bestTime: "Oct – Mar", entryFee: "₹100 / ₹600 foreign", timings: "9:00 AM – 5:00 PM", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200" },
  { id: "6", name: "Kaziranga Grasslands", slug: "kaziranga-national-park", city: "Golaghat", state: "Assam", category: "Nature", description: "UNESCO-listed floodplain wetlands, home to two-thirds of the world's one-horned rhinos.", bestTime: "Nov – Apr", entryFee: "₹100 + jeep safari", timings: "7:30 AM – 4:00 PM", image: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?q=80&w=1200" },
];

const CATEGORIES: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "All", label: "All", icon: Compass },
  { id: "Heritage", label: "Heritage", icon: Landmark },
  { id: "Spiritual", label: "Spiritual", icon: Flame },
  { id: "Nature", label: "Nature", icon: Mountain },
  { id: "Adventure", label: "Adventure", icon: Palmtree },
];

interface SoundTrack {
  id: string;
  title: string;
  locale: string;
  state: string;
  tag: string;
  icon: LucideIcon;
  frequencies: number[];
}

const SOUNDSCAPES: SoundTrack[] = [
  { id: "varanasi", title: "Ganga Twilight Resonances", locale: "Dashashwamedh Ghat", state: "Uttar Pradesh", tag: "Aarti bells & deep harmonics", icon: Bell, frequencies: [216, 432, 648] },
  { id: "spiti", title: "Trans-Himalayan Gale", locale: "Key Gompa Pass", state: "Himachal Pradesh", tag: "High alpine wind currents", icon: Mountain, frequencies: [108, 162, 324] },
  { id: "munnar", title: "Rainforest Precipitation", locale: "Eravikulam Canopy", state: "Kerala", tag: "Tropical shola cloud-drip", icon: Waves, frequencies: [300, 450, 600] },
  { id: "thar", title: "Desert Dune Whispers", locale: "Sam Sand Dunes", state: "Rajasthan", tag: "Silica sand drifts", icon: Wind, frequencies: [150, 225, 300] },
];
/* ───────────────────────── Shared bits ───────────────────────── */
function SectionHead({
  kicker,
  title,
  blurb,
  dark = false,
}: {
  kicker: string;
  title: React.ReactNode;
  blurb: string;
  dark?: boolean;
}) {
  return (
    <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div>
        <p className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-[#D35234]">
          {kicker}
        </p>
        <h2
          className={`font-serif text-5xl font-light leading-[0.98] tracking-tight md:text-7xl ${
            dark ? "text-white" : "text-[#1C1C1C]"
          }`}
        >
          {title}
        </h2>
      </div>
      <p
        className={`max-w-sm text-sm font-medium leading-relaxed ${
          dark ? "text-white/55" : "text-[#1C1C1C]/55"
        }`}
      >
        {blurb}
      </p>
    </div>
  );
}

/* ───────────────────────── 1. Hero ───────────────────────── */
function Hero() {
  return (
    <section className="relative flex h-[96svh] min-h-[720px] flex-col px-3 pb-8 pt-6 sm:px-6 lg:px-12">
      <div className="relative flex flex-1 items-end overflow-hidden rounded-[2.5rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.18)] sm:rounded-[3rem] sm:p-12 lg:p-16">
        
        {/* YOUTUBE BACKGROUND VIDEO INTEGRATION */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none bg-black">
          <iframe
            src="https://www.youtube.com/embed/FOvOxeb2TCg?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=FOvOxeb2TCg&modestbranding=1&playsinline=1"
            allow="autoplay; encrypted-media"
            className="absolute top-1/2 left-1/2 w-[300%] h-[300%] sm:w-[150vw] sm:h-[150vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-85 object-cover"
            style={{ border: 0 }}
          />
        </div>
        
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-transparent" />

        <div className="relative z-10 flex w-full flex-col gap-10">
          <div className="grid items-end gap-8 md:grid-cols-12">
            <div className="md:col-span-8">
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-white backdrop-blur-md">
                <Compass className="h-3.5 w-3.5 text-[#E8956F]" />
                The Indian Atlas
              </span>
              <h1 className="anim-rise font-serif text-[clamp(3.4rem,10.5vw,8.5rem)] font-light leading-[0.9] tracking-[-0.03em] text-white drop-shadow-2xl">
                Beyond the <br />
                <span className="italic text-[#E8DCC4]">Postcards.</span>
              </h1>
            </div>

            <div className="max-w-sm text-white/85 md:col-span-4 md:justify-self-end">
              <p className="mb-6 text-sm font-medium leading-relaxed drop-shadow-md">
                A curated, verified digital encyclopedia of India&apos;s most profound
                architectural, spiritual and natural wonders.
              </p>
              <a
                href="#the-atlas"
                className="group inline-flex items-center gap-4 rounded-full bg-[#D35234] py-2 pl-6 pr-2 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-[0_0_30px_rgba(211,82,52,0.45)] transition-all hover:bg-white hover:text-[#1C1C1C]"
              >
                Begin the journey
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 transition-colors group-hover:bg-[#D35234] group-hover:text-white">
                  <ArrowDown className="h-5 w-5" />
                </span>
              </a>
            </div>
          </div>

          <nav
            aria-label="Jump to section"
            className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/20 pt-6"
          >
            {HERO_NAV.map((n, i) => (
              <a
                key={n.href}
                href={n.href}
                className="group flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white"
              >
                <span className="font-mono text-[10px] text-[#E8956F]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {n.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── 2. Atlas (bento) ───────────────────────── */
function Atlas() {
  return (
    <section id="the-atlas" className="mx-auto max-w-[1400px] px-6 py-24 lg:px-12">
      <SectionHead
        kicker="01 — The Geopolitical Atlas"
        title={
          <>
            The Geopolitical <br className="hidden md:block" />
            <span className="italic">Atlas.</span>
          </>
        }
        blurb="Explore 28 states and 8 union territories organized through an editorial geographic lens."
      />

  
<div className="grid auto-rows-[280px] grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
  {REGIONS.map((r) => (
    <Link
      key={r.name}
      href={`/states?region=${encodeURIComponent(r.name)}`}
      className={`group relative block overflow-hidden rounded-[2.5rem] border border-black/5 shadow-xl ${r.cls}`}
    >
      <Image
        src={r.img}
        alt={r.name}
        fill
        unoptimized
        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/80 transition-colors duration-700 group-hover:from-black/0" />
      <span className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-[#D35234] group-hover:border-[#D35234]">
        <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
      <div className={`absolute bottom-0 left-0 right-0 ${r.big ? "p-8" : "p-6"}`}>
        {r.meta && (
          <span className="mb-3 inline-block rounded-full bg-[#D35234] px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-widest text-white shadow-md">
            {r.meta}
          </span>
        )}
        <h3 className={`font-serif font-light leading-tight text-white ${r.big ? "text-4xl lg:text-6xl" : "text-2xl lg:text-3xl"}`}>
          {r.name}
        </h3>
      </div>
    </Link>
  ))}
</div>
    </section>
  );
}

/* ───────────────────────── 3. Living Heritage ───────────────────────── */
function LivingHeritage() {
  const [active, setActive] = useState(0);

  return (
    <section id="heritage" className="mx-auto max-w-[1500px] px-4 py-24 sm:px-6 lg:px-12">
      <SectionHead
        kicker="02 — Made by hand"
        title={
          <>
            Living <span className="italic">heritage</span>
          </>
        }
        blurb="Four GI-tagged craft traditions, each tied to a place you can actually visit — and to the artisans who keep it going."
      />

      <div className="flex flex-col gap-3 lg:h-[660px] lg:flex-row lg:gap-4">
        {CRAFTS.map((c, i) => {
          const open = active === i;
          return (
            <article
              key={c.id}
              tabIndex={0}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              className={`relative min-h-[460px] cursor-pointer overflow-hidden rounded-[2rem] bg-[#1C1C1C] outline-none transition-[flex] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:ring-2 focus-visible:ring-[#D35234] ${
                open ? "lg:flex-[4.2]" : "lg:flex-[1]"
              }`}
            >
              <Image
                src={c.image}
                alt={c.name}
                fill
                unoptimized
                className={`object-cover transition-all duration-1000 ${
                  open ? "lg:scale-100 lg:opacity-100" : "lg:scale-110 lg:opacity-60"
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/15" />

              {/* Collapsed rail (desktop) */}
              <div
                className={`absolute inset-0 hidden flex-col items-center justify-between py-7 transition-opacity duration-500 lg:flex ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              >
                <span className="font-mono text-xs text-white/70">{c.id}</span>
                <h3
                  className="whitespace-nowrap font-serif text-2xl font-light tracking-wide text-white"
                  style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                  {c.name}
                </h3>
                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[#E8956F]">
                  {c.category}
                </span>
              </div>

              {/* Expanded content (always visible on mobile) */}
              <div
                className={`absolute inset-0 flex flex-col justify-between p-6 transition-opacity duration-500 md:p-10 ${
                  open
                    ? "opacity-100 lg:delay-300"
                    : "opacity-100 lg:pointer-events-none lg:opacity-0"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-serif text-6xl font-light italic leading-none text-white/85 lg:text-[6.5rem]">
                    {c.id}
                  </span>
                  <span className="rounded-md border border-white/35 bg-black/25 px-3 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
                    GI Tag · {c.giTag}
                  </span>
                </div>

                <div className="max-w-lg">
                  <p className="mb-4 flex items-center gap-3 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[#E8956F]">
                    {c.category}
                    <span className="h-1 w-1 rounded-full bg-[#E8956F]" />
                    {c.state}
                  </p>
                  <h3 className="mb-4 font-serif text-4xl font-light leading-tight text-white md:text-5xl">
                    {c.name}
                  </h3>
                  <p className="mb-7 text-sm font-medium leading-relaxed text-white/80 md:text-base">
                    {c.desc}
                  </p>

                  <div className="flex flex-col justify-between gap-5 border-t border-white/20 pt-5 sm:flex-row sm:items-center">
                    <span className="flex items-center gap-2 text-sm font-semibold text-[#F5F4F0]">
                      <MapPin className="h-4 w-4 text-[#E8956F]" />
                      {c.location}
                    </span>
                    <Link
                      href="/destinations"
                      className="inline-flex items-center gap-2 self-start rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#1C1C1C] shadow-xl transition-colors hover:bg-[#D35234] hover:text-white"
                    >
                      Explore the region
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}


/* ───────────────────────── 4. Cinema carousel ───────────────────────── */
function CinemaCarousel() {
  const scroller = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const n = SIGNATURE_VIDEOS.length;

  // Play a clip only while its card is on screen
  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const i = Number((e.target as HTMLElement).dataset.i);
          const v = vids.current[i];
          if (v) {
            if (e.isIntersecting) v.play().catch(() => {});
            else v.pause();
          }
          if (e.intersectionRatio > 0.6) setActive(i);
        });
      },
      { root, threshold: [0, 0.6] }
    );
    cards.current.forEach((c) => c && io.observe(c));
    return () => io.disconnect();
  }, []);

  const go = (i: number) =>
    cards.current[(i + n) % n]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });

  const btn =
    "flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-[#1C1C1C]";

  return (
    <section
      id="cinema"
      className="mx-2 mb-24 overflow-hidden rounded-[3rem] border border-white/5 bg-[#0E0D0C] py-24 shadow-2xl sm:mx-6"
    >
      <div className="mx-auto mb-14 flex max-w-[1400px] flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-end lg:px-12">
        <div>
          <p className="mb-4 flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-[#E8956F]">
            <Activity className="h-4 w-4 animate-pulse" />
            03 — Living Cinema Directory
          </p>
          <h2 className="font-serif text-5xl font-light leading-[0.98] tracking-tight text-white md:text-7xl">
            Signature <span className="italic text-white/50">Destinations.</span>
          </h2>
        </div>
        <div className="flex items-center gap-6">
          <p className="hidden max-w-xs text-sm font-medium leading-relaxed text-white/50 lg:block">
            Swipe through a curated, ASI-verified set of the subcontinent&apos;s most
            profound monuments, rendered in motion.
          </p>
          <div className="flex gap-2">
            <button onClick={() => go(active - 1)} className={btn} aria-label="Previous">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={() => go(active + 1)} className={btn} aria-label="Next">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scroller}
        className="no-scrollbar flex w-full snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-6 lg:px-12"
      >
        {SIGNATURE_VIDEOS.map((p, i) => (
          <div
            key={p.id}
            data-i={i}
            ref={(el) => {
              cards.current[i] = el;
            }}
            className="group w-[85vw] shrink-0 snap-center sm:w-[420px]"
          >
            <Link href={`/destinations/${p.slug}`} className="block">
              <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                <video
                  ref={(el) => {
                    vids.current[i] = el;
                  }}
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  poster={p.poster}
                  className="absolute inset-0 h-full w-full scale-105 object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                >
                  <source src={p.videoUrl} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0D0C] via-black/20 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-60" />

                <span className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/60 px-4 py-2 font-mono text-[10px] font-medium uppercase tracking-widest text-[#E8956F] backdrop-blur-xl">
                  {p.tag}
                </span>
                <span className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-colors group-hover:border-[#D35234] group-hover:bg-[#D35234]">
                  <ArrowUpRight className="h-5 w-5" />
                </span>

                <div className="absolute inset-x-6 bottom-6">
                  <p className="mb-2 flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-widest text-[#E8956F]">
                    <MapPin className="h-3.5 w-3.5" />
                    {p.state}
                  </p>
                  <h3 className="font-serif text-4xl font-light text-white">{p.name}</h3>
                </div>
              </div>
            </Link>

            <p className="line-clamp-2 px-2 text-sm font-medium leading-relaxed text-white/60">
              {p.desc}
            </p>
            <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 px-2 font-mono text-[10px] uppercase tracking-widest text-white/35">
              <span>{p.metrics.era}</span>
              <span>{p.metrics.altitude}</span>
              <span>{p.metrics.entry}</span>
            </p>
          </div>
        ))}
        <div className="w-6 shrink-0 lg:w-12" aria-hidden />
      </div>

      <div className="mt-4 flex justify-center gap-2" aria-hidden>
        {SIGNATURE_VIDEOS.map((p, i) => (
          <span
            key={p.id}
            className={`h-1 rounded-full transition-all duration-500 ${
              active === i ? "w-10 bg-[#D35234]" : "w-4 bg-white/20"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── 5. Directory ───────────────────────── */
function Directory() {
  const [cat, setCat] = useState("All");
  const places = cat === "All" ? DESTINATIONS : DESTINATIONS.filter((d) => d.category === cat);

  return (
    <section id="destinations" className="mx-auto max-w-[1400px] px-6 py-24 lg:px-12">
      <SectionHead
        kicker="04 — The directory"
        title={
          <>
            Plan the <span className="italic">visit.</span>
          </>
        }
        blurb="Best season, ticket price and opening hours for six signature stops — so the plan on paper matches the gate in front of you."
      />

      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="Filter destinations"
          className="no-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-full border border-black/5 bg-white p-1.5 shadow-sm"
        >
          {CATEGORIES.map((t) => {
            const Icon = t.icon;
            const on = cat === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={on}
                onClick={() => setCat(t.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-all ${
                  on ? "bg-[#1C1C1C] text-white" : "text-[#1C1C1C]/50 hover:text-[#1C1C1C]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#1C1C1C]/45">
          {places.length} {places.length === 1 ? "place" : "places"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {places.map((p) => (
          <Link
            key={p.id}
            href={`/destinations/${p.slug}`}
            className="group flex flex-col overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-lg transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={p.image}
                alt={p.name}
                fill
                unoptimized
                className="object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-widest text-[#1C1C1C] backdrop-blur-md">
                {p.category}
              </span>
              <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[#1C1C1C]/80 px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-widest text-white backdrop-blur-md">
                <ShieldCheck className="h-3 w-3 text-[#E8956F]" />
                Verified
              </span>
              <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 text-sm font-medium text-white">
                <MapPin className="h-3.5 w-3.5 text-[#E8956F]" />
                {p.city}, {p.state}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-serif text-3xl font-light leading-tight text-[#1C1C1C] transition-colors group-hover:text-[#D35234]">
                  {p.name}
                </h3>
                <ArrowUpRight className="mt-2 h-5 w-5 shrink-0 text-[#1C1C1C]/35 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#D35234]" />
              </div>
              <p className="mt-3 text-sm font-medium leading-relaxed text-[#1C1C1C]/60">
                {p.description}
              </p>

              <dl className="mt-6 font-mono text-[11px] uppercase tracking-[0.1em]">
                {[
                  ["Best time", p.bestTime],
                  ["Entry", p.entryFee],
                  ["Hours", p.timings],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-baseline justify-between gap-4 border-t border-dashed border-black/15 py-2.5"
                  >
                    <dt className="text-[#1C1C1C]/40">{k}</dt>
                    <dd className="text-right font-medium text-[#1C1C1C]">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── 6. Soundscapes ───────────────────────── */
function Equalizer() {
  return (
    <div className="flex h-10 items-end gap-[3px]" aria-hidden>
      {Array.from({ length: 28 }).map((_, i) => (
        <span
          key={i}
          className="anim-eq w-[3px] origin-bottom rounded-full bg-[#E8956F]"
          style={{
            height: "100%",
            animationDuration: `${0.6 + ((i * 37) % 70) / 50}s`,
            animationDelay: `${(i % 7) * -0.13}s`,
          }}
        />
      ))}
    </div>
  );
}

function Soundscapes() {
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ gain: GainNode; sources: OscillatorNode[] } | null>(null);

  const stopAudio = () => {
    const ctx = ctxRef.current;
    const nodes = nodesRef.current;
    if (ctx && nodes) {
      const t = ctx.currentTime;
      nodes.gain.gain.cancelScheduledValues(t);
      nodes.gain.gain.setValueAtTime(Math.max(nodes.gain.gain.value, 0.0001), t);
      nodes.gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      nodes.sources.forEach((o) => {
        try {
          o.stop(t + 0.55);
        } catch {}
      });
    }
    nodesRef.current = null;
    setActiveTrack(null);
  };

  const play = (track: SoundTrack) => {
    if (activeTrack === track.id) return stopAudio();
    stopAudio();

    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;

    const ctx = ctxRef.current ?? new Ctor();
    ctxRef.current = ctx;
    if (ctx.state === "suspended") ctx.resume();

    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.09, now + 1.8);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1400;
    filter.connect(master);
    master.connect(ctx.destination);

    // Slow "breathing" LFO so the drone feels alive
    const lfo = ctx.createOscillator();
    const lfoDepth = ctx.createGain();
    lfo.frequency.value = 0.13;
    lfoDepth.gain.value = 300;
    lfo.connect(lfoDepth);
    lfoDepth.connect(filter.frequency);
    lfo.start();

    const sources: OscillatorNode[] = [lfo];
    track.frequencies.forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = i === 0 ? "sine" : "triangle";
      osc.frequency.value = f;
      osc.detune.value = i * 4;
      osc.connect(filter);
      osc.start();
      sources.push(osc);
    });

    nodesRef.current = { gain: master, sources };
    setActiveTrack(track.id);
  };

  useEffect(() => {
    return () => {
      nodesRef.current?.sources.forEach((o) => {
        try {
          o.stop();
        } catch {}
      });
      ctxRef.current?.close().catch(() => {});
    };
  }, []);

  return (
    <section
      id="soundscapes"
      className="mx-2 mb-24 rounded-[3rem] bg-[#0E0D0C] px-6 py-24 shadow-2xl sm:mx-6 lg:px-12"
    >
      <div className="mx-auto max-w-[1400px]">
        <SectionHead
          dark
          kicker="05 — Listen before you leave"
          title={
            <>
              The Acoustic <span className="italic text-white/50">Atlas</span>
            </>
          }
          blurb="Close your eyes. Each track is a synthesised drone built from the tones of a place — put on headphones, press play, and arrive early."
        />

        <ul className="border-t border-white/15">
          {SOUNDSCAPES.map((t, idx) => {
            const Icon = t.icon;
            const on = activeTrack === t.id;
            return (
              <li key={t.id} className="border-b border-white/15">
                <button
                  onClick={() => play(t)}
                  aria-pressed={on}
                  aria-label={`${on ? "Stop" : "Play"} ${t.title}`}
                  className={`group relative grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-6 py-8 text-left transition-colors md:grid-cols-[4rem_1.4fr_1fr_auto] md:gap-x-10 lg:py-10 ${
                    on ? "bg-white/[0.05]" : "hover:bg-white/[0.03]"
                  }`}
                >
                  <span
                    className={`absolute left-0 top-0 h-full w-[3px] origin-top bg-[#D35234] transition-transform duration-500 ${
                      on ? "scale-y-100" : "scale-y-0"
                    }`}
                  />
                  <span className="pl-4 font-mono text-sm text-white/40 md:pl-6">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block font-serif text-2xl font-light leading-tight text-white transition-colors group-hover:text-[#E8956F] md:text-4xl">
                      {t.title}
                    </span>
                    <span className="mt-2 flex items-center gap-2 text-sm text-white/50">
                      <Icon className="h-3.5 w-3.5 text-[#E8956F]" />
                      {t.tag}
                    </span>
                  </span>
                  <span className="hidden md:block">
                    {on ? (
                      <Equalizer />
                    ) : (
                      <span className="block">
                        <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">
                          {t.locale}
                        </span>
                        <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                          {t.state}
                        </span>
                      </span>
                    )}
                  </span>
                  <span
                    className={`mr-4 flex h-14 w-14 items-center justify-center rounded-full border transition-all md:mr-6 ${
                      on
                        ? "border-[#D35234] bg-[#D35234] text-white"
                        : "border-white/25 text-white group-hover:border-white"
                    }`}
                  >
                    {on ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ───────────────────────── 7. Climate (stacked) ───────────────────────── */
function Climate() {
  const keys = Object.keys(SEASONS) as SeasonKey[];

  return (
    <section id="seasons" className="relative mx-auto max-w-[1400px] px-6 py-24 lg:px-12">
      <div className="flex flex-col items-start gap-14 lg:flex-row lg:gap-20">
        {/* Sticky intro */}
        <div className="space-y-6 lg:sticky lg:top-28 lg:w-1/3">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#D35234]/25 bg-[#D35234]/10 px-4 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-[#D35234]">
            <Thermometer className="h-3.5 w-3.5" />
            06 — Climate Intelligence
          </p>
          <h2 className="font-serif text-5xl font-light leading-[1.02] tracking-tight text-[#1C1C1C] md:text-7xl">
            When to <span className="italic">go.</span>
          </h2>
          <p className="text-lg font-medium leading-relaxed text-[#1C1C1C]/60">
            India spans six distinct climate zones. Here are the seasonal windows to see
            these places at their prime — and what to pack for each.
          </p>

          <nav aria-label="Seasons" className="hidden border-t border-black/10 lg:block">
            {keys.map((k) => {
              const Icon = SEASONS[k].icon;
              return (
                <a
                  key={k}
                  href={`#season-${k.toLowerCase()}`}
                  className="group flex items-center justify-between border-b border-black/10 py-4 text-sm font-semibold text-[#1C1C1C]/70 transition-colors hover:text-[#D35234]"
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {k}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#1C1C1C]/40">
                    {SEASONS[k].months}
                  </span>
                </a>
              );
            })}
          </nav>

          <p className="hidden rounded-[1.5rem] border border-black/5 bg-white p-5 text-sm font-medium leading-relaxed text-[#1C1C1C]/65 shadow-md lg:block">
            Seasonal windows are guides, not guarantees. Check local conditions before you
            travel.
          </p>
        </div>

        {/* Stacked season cards */}
        <div className="w-full space-y-10 lg:w-2/3">
          {keys.map((k) => {
            const s = SEASONS[k];
            const Icon = s.icon;
            return (
              <article
                key={k}
                id={`season-${k.toLowerCase()}`}
                className="scroll-mt-28 space-y-8 rounded-[3rem] border border-black/5 bg-white p-6 shadow-xl md:p-10"
              >
                <div className="flex flex-col justify-between gap-6 border-b border-black/10 pb-8 md:flex-row md:items-start">
                  <div>
                    <div
                      className={`mb-5 inline-flex items-center gap-2 rounded-md px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-widest ${s.bgAccent} ${s.color}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {s.months}
                    </div>
                    <h3 className="font-serif text-4xl font-light text-[#1C1C1C]">{s.title}</h3>
                    <p className="mt-3 max-w-md text-sm font-medium leading-relaxed text-[#1C1C1C]/60 md:text-base">
                      {s.desc}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-row gap-3 md:flex-col">
                    <div className="rounded-xl border border-black/5 bg-[#F5F4F0] px-4 py-3">
                      <Thermometer className="mb-1.5 h-4 w-4 text-[#D35234]" />
                      <span className="block font-mono text-[9px] uppercase tracking-widest text-black/40">
                        Avg Temp
                      </span>
                      <span className="font-mono text-sm font-semibold text-black">
                        {s.metrics.temp}
                      </span>
                    </div>
                    <div className="rounded-xl border border-black/5 bg-[#F5F4F0] px-4 py-3">
                      <Droplets className="mb-1.5 h-4 w-4 text-sky-500" />
                      <span className="block font-mono text-[9px] uppercase tracking-widest text-black/40">
                        Atmosphere
                      </span>
                      <span className="font-mono text-sm font-semibold text-black">
                        {s.metrics.humidity}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  {s.places.map((p) => (
                    <Link key={p.slug} href={`/destinations/${p.slug}`} className="group block">
                      <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-black/5 shadow-lg">
                        <Image
                          src={p.img}
                          alt={p.name}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                        />
                        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 font-mono text-[9px] font-medium uppercase tracking-widest text-black shadow-sm backdrop-blur-md">
                          {p.tag}
                        </span>
                      </div>
                      <h4 className="font-serif text-2xl font-light text-[#1C1C1C] transition-colors group-hover:text-[#D35234]">
                        {p.name}
                      </h4>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[#1C1C1C]/40">
                        {p.state}
                      </p>
                      <span className="mt-3 flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-widest text-[#D35234]">
                        Dossier
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  ))}
                </div>

                <div className="flex flex-col justify-between gap-2 border-t border-black/5 pt-6 sm:flex-row sm:items-center">
                  <span className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-widest text-black/45">
                    <Backpack className="h-4 w-4" />
                    Pack list
                  </span>
                  <span className="text-sm font-semibold text-[#1C1C1C]">{s.gear}</span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── 8. Footer ───────────────────────── */
function Footer() {
  const cols = [
    [
      { l: "The Atlas", h: "#the-atlas" },
      { l: "Heritage", h: "#heritage" },
      { l: "Cinema", h: "#cinema" },
    ],
    [
      { l: "Directory", h: "#destinations" },
      { l: "Soundscapes", h: "#soundscapes" },
      { l: "Seasons", h: "#seasons" },
    ],
  ];
  return (
    <footer className="mx-2 mb-2 mt-12 rounded-t-[3rem] bg-[#1C1C1C] px-6 pb-12 pt-24 text-white sm:mx-6 lg:px-12">
      <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-12 border-b border-white/10 pb-16 md:flex-row md:items-end">
        <div>
          <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-[#D35234] shadow-[0_0_30px_rgba(211,82,52,0.35)]">
            <span className="font-serif text-3xl font-bold text-white">भ</span>
          </div>
          <h2 className="font-serif text-6xl font-light leading-none tracking-tight md:text-[6rem]">
            TravelBharat<span className="text-[#D35234]">.</span>
          </h2>
          <p className="mt-5 max-w-sm text-sm font-medium text-white/50">
            A field guide to a country that rewards slow travel.
          </p>
        </div>

        <div className="flex gap-12 font-mono text-xs font-medium uppercase tracking-[0.2em] text-white/45">
          {cols.map((col, i) => (
            <div key={i} className="flex flex-col gap-5">
              {col.map((x) => (
                <Link key={x.h} href={x.h} className="transition-colors hover:text-white">
                  {x.l}
                </Link>
              ))}
              {i === 1 && (
                <Link href="/admin/login" className="text-[#E8956F] transition-colors hover:text-white">
                  Admin Hub
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-[1400px] flex-col items-center justify-between gap-4 font-mono text-[10px] font-medium uppercase tracking-widest text-white/30 sm:flex-row">
        <span>© 2026 Unified Mentor Capstone</span>
        <span>Engineered for Luxury Discovery</span>
      </div>
    </footer>
  );
}

/* ───────────────────────── Page ───────────────────────── */
export default function HomePage() {
  return (
    <main
      className={`${display.variable} ${body.variable} ${mono.variable} min-h-screen bg-[#F5F4F0] font-[family-name:var(--font-body)] text-[#1C1C1C] antialiased selection:bg-[#D35234] selection:text-white`}
    >
      <LuxuryNavbar />
      <Hero />
      <Atlas />
      <LivingHeritage />
      <CinemaCarousel />
      <Directory />
      <Soundscapes />
      <Climate />
      <UNESCOHeritage />
      <Footer />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        html { scroll-behavior: smooth; }
        .font-serif { font-family: var(--font-display), ui-serif, Georgia, serif; }
        .font-mono { font-family: var(--font-mono), ui-monospace, monospace; }
        @keyframes rise { from { opacity: 0; transform: translateY(32px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes eq { from { transform: scaleY(0.15) } to { transform: scaleY(1) } }
        .anim-rise { animation: rise 1s cubic-bezier(.2,.7,.2,1) both; }
        .anim-eq { animation: eq 0.9s ease-in-out infinite alternate; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
          .anim-rise, .anim-eq { animation: none !important; }
        }
      `,
        }}
      />
    </main>
  );
}