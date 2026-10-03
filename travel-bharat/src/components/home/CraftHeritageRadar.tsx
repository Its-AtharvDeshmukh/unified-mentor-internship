"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, MapPin } from "lucide-react";

const HERITAGE_CRAFTS = [
  {
    name: "Kanchipuram Mulberry Silk",
    region: "Kanchipuram Corridor",
    state: "Tamil Nadu",
    giTagYear: "GI Tag: 2005",
    category: "Textile",
    significance: "Handwoven pure mulberry silk with korvai interlocking borders using gold-dipped silver zari threads. A living tradition mastered by the Pillayar Palayam temple weaver guilds.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200",
    slug: "kanchipuram",
  },
  {
    name: "Pashmina & Sozni Needlecraft",
    region: "Srinagar & Changthang",
    state: "Jammu & Kashmir",
    giTagYear: "GI Tag: 2008",
    category: "Textile",
    significance: "Handspun Changthangi mountain goat fleece decorated with high-density micro-needlepoint embroidery. Mastered over 600 years in the alleys of Downtown Srinagar.",
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=1200",
    slug: "kashmir-crafts",
  },
  {
    name: "Thanjavur Relief Painting",
    region: "Cauvery Delta Basin",
    state: "Tamil Nadu",
    giTagYear: "GI Tag: 2007",
    category: "Art",
    significance: "Gesso chalk relief coated with 22-carat gold foil leaves and studded with semi-precious Jaipur gems, a regal tradition passed down from the 16th-century Maratha Court.",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200",
    slug: "thanjavur-art",
  },
  {
    name: "Bidriware Silver Inlay",
    region: "Bidar Bastion",
    state: "Karnataka",
    giTagYear: "GI Tag: 2006",
    category: "Metalwork",
    significance: "Zinc-copper alloy blackened using ancient fort soil and inlaid with pure silver geometric wires, an aristocratic craft sustained within the Bidar Old Walled City.",
    image: "https://images.unsplash.com/photo-1600100397608-f010f4439c63?q=80&w=1200",
    slug: "bidar-metalwork",
  },
];

export function CraftHeritageRadar() {
  return (
    <section className="py-32 px-6 lg:px-12 max-w-7xl mx-auto border-t border-white/10">
      <div className="text-center max-w-3xl mx-auto mb-24">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E2725B]/10 border border-[#E2725B]/20 text-xs font-semibold uppercase tracking-[0.25em] text-[#E2725B] mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Indigenous GI-Tagged Traditions</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-serif font-light text-white tracking-tight leading-tight">
          Artisanal & <br /> Living Heritage
        </h2>
        <p className="text-white/60 text-base md:text-lg mt-6 font-light leading-relaxed">
          Connect your journeys directly to certified Geographical Indication craft clusters, ancient weaver guilds, and master artisans preserving centuries of Indian civilization.
        </p>
      </div>

      <div className="space-y-32">
        {HERITAGE_CRAFTS.map((item, index) => {
          const isReverse = index % 2 !== 0;
          return (
            <div key={item.name} className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${isReverse ? "lg:flex-row-reverse" : ""}`}>
              
              {/* Massive Image Side */}
              <div className="w-full lg:w-1/2">
                <div className="relative aspect-[4/5] lg:aspect-[3/4] rounded-[2rem] overflow-hidden group border border-white/10 shadow-2xl">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
                  
                  <div className="absolute top-6 left-6">
                    <span className="text-[10px] uppercase tracking-widest font-semibold px-4 py-2 rounded-full bg-black/80 text-[#F4C430] backdrop-blur-md border border-white/20 shadow-xl">
                      {item.giTagYear}
                    </span>
                  </div>
                </div>
              </div>

              {/* Typography & Details Side */}
              <div className="w-full lg:w-1/2 relative">
                <div className="absolute -left-10 -top-20 text-[200px] font-serif font-bold text-white/[0.02] pointer-events-none select-none z-0">
                  0{index + 1}
                </div>
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#E2725B]">
                      {item.category}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    <span className="text-xs uppercase tracking-widest text-white/50">
                      {item.state}
                    </span>
                  </div>

                  <h3 className="text-4xl md:text-5xl font-serif text-white leading-tight">
                    {item.name}
                  </h3>

                  <p className="text-lg text-white/70 font-light leading-relaxed">
                    {item.significance}
                  </p>

                  <div className="pt-8 border-t border-white/10">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Primary Artisan Cluster</p>
                    <div className="flex items-center gap-2 text-white/90 font-medium">
                      <MapPin className="w-4 h-4 text-[#F4C430]" />
                      <span>{item.region}</span>
                    </div>
                  </div>

                  <div className="pt-6">
                    <Link
                      href={`/destinations/${item.slug}`}
                      className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 text-sm uppercase tracking-widest font-semibold text-white transition-all group"
                    >
                      <span>Explore Craft Region</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#F4C430]" />
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
}