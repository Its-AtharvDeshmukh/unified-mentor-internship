"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  Landmark,
  Flame,
  Mountain,
  Palmtree,
  Calendar,
  Clock,
  IndianRupee,
  MapPin,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface DestinationItem {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  category: "Heritage" | "Spiritual" | "Nature" | "Adventure";
  description: string;
  bestTime: string;
  entryFee: string;
  timings: string;
  verified: boolean;
  image: string;
}

const DESTINATIONS: DestinationItem[] = [
  {
    id: "1",
    name: "Varanasi Ghats",
    slug: "varanasi-ghats",
    city: "Varanasi",
    state: "Uttar Pradesh",
    category: "Spiritual",
    description: "Sacred stone riverfront terraces, ancient Vedic chanting, and evening Ganga Aarti ceremonies.",
    bestTime: "Oct – Mar",
    entryFee: "Free Entry",
    timings: "24 Hours (Aarti 6:30 PM)",
    verified: true,
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1200",
  },
  {
    id: "2",
    name: "Hampi Monuments",
    slug: "hampi-monuments",
    city: "Vijayanagara",
    state: "Karnataka",
    category: "Heritage",
    description: "Granite monolithic ruins, royal enclosures, and stone chariot shrines of the Vijayanagara Empire.",
    bestTime: "Nov – Feb",
    entryFee: "₹40 (Ind) / ₹600 (For)",
    timings: "6:00 AM – 6:00 PM",
    verified: true,
    image: "https://images.unsplash.com/photo-1600100397608-f010f4439c63?q=80&w=1200",
  },
  {
    id: "3",
    name: "Munnar Tea Hills",
    slug: "munnar-plantations",
    city: "Idukki",
    state: "Kerala",
    category: "Nature",
    description: "High mountain plantations, rare flora, and cloud-covered valleys across the Western Ghats.",
    bestTime: "Sep – May",
    entryFee: "₹125 (Park Entry)",
    timings: "7:00 AM – 4:30 PM",
    verified: true,
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1200",
  },
  {
    id: "4",
    name: "Pangong Tso Basin",
    slug: "pangong-tso",
    city: "Leh",
    state: "Ladakh",
    category: "Adventure",
    description: "Crystalline saline lake at 14,270 ft altitude shifting through turquoise and cobalt hues.",
    bestTime: "Jun – Sep",
    entryFee: "₹400 (Permit Fee)",
    timings: "Sunrise – Sunset",
    verified: true,
    image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=1200",
  },
  {
    id: "5",
    name: "Mehrangarh Fort",
    slug: "mehrangarh-fort",
    city: "Jodhpur",
    state: "Rajasthan",
    category: "Heritage",
    description: "Towering 400-foot red sandstone fortress guarding the historic Blue City perimeter.",
    bestTime: "Oct – Mar",
    entryFee: "₹100 (Ind) / ₹600 (For)",
    timings: "9:00 AM – 5:00 PM",
    verified: true,
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200",
  },
  {
    id: "6",
    name: "Kaziranga Grasslands",
    slug: "kaziranga-national-park",
    city: "Golaghat",
    state: "Assam",
    category: "Nature",
    description: "Protected UNESCO wetland floodplains harboring two-thirds of the world's Great One-Horned Rhinos.",
    bestTime: "Nov – Apr",
    entryFee: "₹100 + Jeep Safari",
    timings: "7:30 AM – 4:00 PM",
    verified: true,
    image: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?q=80&w=1200",
  },
];

const CATEGORIES = [
  { id: "All", label: "All Destinations", icon: Compass },
  { id: "Heritage", label: "Heritage", icon: Landmark },
  { id: "Spiritual", label: "Spiritual", icon: Flame },
  { id: "Nature", label: "Nature", icon: Mountain },
  { id: "Adventure", label: "Adventure", icon: Palmtree },
];

export function CuratedTravelDirectory() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPlaces =
    activeCategory === "All"
      ? DESTINATIONS
      : DESTINATIONS.filter((item) => item.category === activeCategory);

  return (
    <section id="destinations" className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Header and horizontal category bar */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-[0.25em] text-[#E2725B] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Travel Directory</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-light text-white tracking-tight">
            Signature Destinations
          </h2>
          <p className="text-white/60 text-sm mt-2 font-light">
            Verified historical monuments and nature sanctuaries with accurate timings and ticketing data.
          </p>
        </div>

        {/* Categories on a single line */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 overflow-x-auto no-scrollbar whitespace-nowrap">
          {CATEGORIES.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all duration-200 cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-[#F4C430] text-black shadow-lg shadow-[#F4C430]/20"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Destination Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPlaces.map((place) => (
          <article
            key={place.id}
            className="group flex flex-col justify-between rounded-2xl overflow-hidden bg-[#141414] border border-white/10 hover:border-[#F4C430]/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            {/* Image Preview with Next.js unoptimized fallback */}
            <div className="relative aspect-[16/10] overflow-hidden bg-black/60">
              <Image
                src={place.image}
                alt={place.name}
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/60" />

              {/* Floating badges */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <span className="text-[10px] uppercase tracking-widest font-semibold px-3 py-1 rounded-full bg-black/80 text-[#F4C430] border border-white/15 backdrop-blur-md">
                  {place.category}
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-medium tracking-wider uppercase px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Verified</span>
                </span>
              </div>

              <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs text-white/90">
                <MapPin className="w-3.5 h-3.5 text-[#F4C430]" />
                <span>{place.city}, {place.state}</span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-2xl font-serif font-normal text-white group-hover:text-[#F4C430] transition-colors">
                  {place.name}
                </h3>
                <p className="text-xs text-white/60 font-light mt-2 line-clamp-2 leading-relaxed">
                  {place.description}
                </p>
              </div>

              {/* Structured Metadata Box */}
              <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-xl bg-white/[0.03] border border-white/5 text-[11px]">
                <div>
                  <span className="text-white/40 uppercase tracking-widest text-[9px] block">Best Time</span>
                  <div className="flex items-center gap-1 text-white/90 font-medium mt-0.5">
                    <Calendar className="w-3 h-3 text-[#E2725B] shrink-0" />
                    <span className="truncate">{place.bestTime}</span>
                  </div>
                </div>

                <div>
                  <span className="text-white/40 uppercase tracking-widest text-[9px] block">Entry Fee</span>
                  <div className="flex items-center gap-1 text-white/90 font-medium mt-0.5">
                    <IndianRupee className="w-3 h-3 text-[#F4C430] shrink-0" />
                    <span className="truncate">{place.entryFee}</span>
                  </div>
                </div>

                <div>
                  <span className="text-white/40 uppercase tracking-widest text-[9px] block">Hours</span>
                  <div className="flex items-center gap-1 text-white/90 font-medium mt-0.5">
                    <Clock className="w-3 h-3 text-sky-400 shrink-0" />
                    <span className="truncate">{place.timings.split("(")[0]}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="pt-2 flex items-center justify-between border-t border-white/10">
                <span className="text-[11px] uppercase tracking-wider text-white/40">TravelBharat Dossier</span>
                <Link
                  href={`/destinations/${place.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#F4C430] hover:text-white transition-colors"
                >
                  <span>Explore Guide</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}