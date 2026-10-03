"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Snowflake, CloudRain, Sun, Thermometer, Droplets, Backpack, ArrowRight, Compass } from "lucide-react";

const SEASON_DATA = {
  Winter: {
    headline: "November to February: Desert Circuits & Coastal Heritage",
    bgGradient: "from-blue-900/40 to-black",
    metrics: { temp: "10°C – 24°C", humidity: "35% (Crisp)", pack: "Thermals & Cottons" },
    highlights: [
      { name: "Jaisalmer Citadel", state: "Rajasthan", tag: "Living Desert Fort", image: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800", slug: "jaisalmer-citadel" },
      { name: "Rann of Kutch", state: "Gujarat", tag: "Seasonal Salt Expanse", image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=800", slug: "rann-of-kutch" },
      { name: "Hampi Ruins", state: "Karnataka", tag: "Monolithic Exploration", image: "https://images.unsplash.com/photo-1600100397608-f010f4439c63?q=80&w=800", slug: "hampi-monuments" },
    ],
  },
  Monsoon: {
    headline: "June to September: Western Ghats & Living Root Trails",
    bgGradient: "from-emerald-900/40 to-black",
    metrics: { temp: "21°C – 28°C", humidity: "85% (Rainfall)", pack: "Waterproof Layers" },
    highlights: [
      { name: "Valley of Flowers", state: "Uttarakhand", tag: "Alpine Botanical Bloom", image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=800", slug: "valley-of-flowers" },
      { name: "Cherrapunji", state: "Meghalaya", tag: "Living Root Suspension", image: "https://images.unsplash.com/photo-1622308644420-a602e1c90554?q=80&w=800", slug: "cherrapunji" },
      { name: "Athirappilly Falls", state: "Kerala", tag: "Scenic Mountain Cascade", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800", slug: "athirappilly-falls" },
    ],
  },
  Summer: {
    headline: "March to June: Trans-Himalayan Buddhist Corridors",
    bgGradient: "from-amber-900/40 to-black",
    metrics: { temp: "8°C – 21°C", humidity: "40% (UV Intense)", pack: "UV Gear & Fleece" },
    highlights: [
      { name: "Spiti Valley", state: "Himachal Pradesh", tag: "Ancient Buddhist Gompas", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800", slug: "spiti-valley" },
      { name: "Nubra Valley", state: "Ladakh", tag: "Cold Desert Sand Dunes", image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=800", slug: "nubra-valley" },
      { name: "Tawang Gompa", state: "Arunachal Pradesh", tag: "Sacred Eastern Himalayas", image: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?q=80&w=800", slug: "tawang-monastery" },
    ],
  },
};

export function SeasonalTravelRadar() {
  const [selectedSeason, setSelectedSeason] = useState<keyof typeof SEASON_DATA>("Winter");
  const season = SEASON_DATA[selectedSeason];

  return (
    <section className="relative py-32 border-t border-white/10 overflow-hidden">
      {/* Dynamic Background */}
      <div className={`absolute inset-0 bg-gradient-to-b ${season.bgGradient} transition-colors duration-1000 -z-10`} />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Massive Glassmorphic Header */}
        <div className="p-8 lg:p-12 rounded-[2rem] bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="flex-1">
              <span className="text-xs uppercase tracking-[0.25em] text-[#F4C430] font-semibold block mb-3">
                Climate Intelligence Console
              </span>
              <h2 className="text-4xl md:text-5xl font-serif text-white tracking-tight leading-tight">
                {season.headline}
              </h2>
            </div>
            
            {/* Immersive Selectors */}
            <div className="flex flex-col gap-3 shrink-0">
              {(["Winter", "Monsoon", "Summer"] as const).map((s) => {
                const isActive = selectedSeason === s;
                return (
                  <button
                    key={s}
                    onClick={() => setSelectedSeason(s)}
                    className={`flex items-center justify-between w-64 px-6 py-4 rounded-2xl text-sm uppercase tracking-widest font-semibold transition-all duration-300 ${
                      isActive ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]" : "bg-black/50 border border-white/10 text-white/50 hover:bg-white/10"
                    }`}
                  >
                    <span>{s} Matrix</span>
                    {s === "Winter" && <Snowflake className="w-4 h-4" />}
                    {s === "Monsoon" && <CloudRain className="w-4 h-4" />}
                    {s === "Summer" && <Sun className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Metrics Ribbon */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10">
            <div className="flex items-center gap-4">
              <Thermometer className="w-8 h-8 text-[#E2725B]" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40">Core Temperature</p>
                <p className="text-lg font-mono font-medium text-white">{season.metrics.temp}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Droplets className="w-8 h-8 text-sky-400" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40">Atmospheric Humidity</p>
                <p className="text-lg font-mono font-medium text-white">{season.metrics.humidity}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Backpack className="w-8 h-8 text-[#F4C430]" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40">Transit Loadout</p>
                <p className="text-sm font-medium text-white">{season.metrics.pack}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Spacious 3-Column Wide Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {season.highlights.map((spot) => (
            <Link
              key={spot.slug}
              href={`/destinations/${spot.slug}`}
              className="group rounded-[2rem] bg-black/60 backdrop-blur-xl border border-white/10 overflow-hidden hover:border-[#F4C430]/60 hover:-translate-y-2 transition-all duration-500 shadow-2xl flex flex-col"
            >
              <div className="relative aspect-[4/3] w-full">
                <Image src={spot.image} alt={spot.name} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-5 left-5">
                  <span className="text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full bg-black/80 text-[#F4C430] backdrop-blur-md border border-white/20">
                    {spot.state}
                  </span>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-3xl font-serif text-white group-hover:text-[#F4C430] transition-colors leading-tight">
                    {spot.name}
                  </h4>
                  <p className="text-sm font-light text-white/60 mt-3 tracking-wide">
                    {spot.tag}
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs uppercase tracking-widest font-semibold text-white/40 group-hover:text-white transition-colors">
                  <span>Explore Route</span>
                  <ArrowRight className="w-4 h-4 text-[#F4C430] group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}