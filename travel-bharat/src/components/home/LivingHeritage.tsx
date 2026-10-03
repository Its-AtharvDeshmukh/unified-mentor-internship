"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

const CRAFT_TRADITIONS = [
  {
    id: "01",
    name: "Kanchipuram Mulberry Silk",
    category: "TEXTILE",
    state: "TAMIL NADU",
    giTag: "2005",
    desc: "Handwoven pure mulberry silk with korvai interlocking borders using gold-dipped silver zari threads.",
    location: "Pillayar Palayam",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200",
  },
  {
    id: "02",
    name: "Pashmina & Sozni Needlecraft",
    category: "TEXTILE",
    state: "JAMMU & KASHMIR",
    giTag: "2008",
    desc: "Handspun Changthangi mountain goat fleece finished with dense micro-needlepoint embroidery, refined over centuries in the lanes of Downtown Srinagar.",
    location: "Srinagar & Changthang",
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=1200",
  },
  {
    id: "03",
    name: "Thanjavur Relief Painting",
    category: "ART",
    state: "TAMIL NADU",
    giTag: "2007",
    desc: "Gesso relief layered with gold foil and set with semi-precious stones — a regal tradition that flourished under the Maratha court of the 16th century onward.",
    location: "Cauvery Delta Basin",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200",
  },
  {
    id: "04",
    name: "Bidriware Silver Inlay",
    category: "METALWORK",
    state: "KARNATAKA",
    giTag: "2006",
    desc: "A zinc-copper alloy blackened with soil from the old fort and inlaid with fine silver wire — an aristocratic craft sustained inside Bidar's walled city.",
    location: "Bidar Bastion",
    image: "https://images.unsplash.com/photo-1600100397608-f010f4439c63?q=80&w=1200",
  },
];

export function LivingHeritage() {
  const [activeIndex, setActiveIndex] = useState(2);

  return (
    <section id="heritage" className="py-24 px-4 sm:px-6 lg:px-12 max-w-[1500px] mx-auto bg-[#F5F4F0]">
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-12 gap-6">
        <div>
          <span className="text-[#D35234] text-[10px] font-bold uppercase tracking-[0.25em] mb-4 block">
            04 — MADE BY HAND
          </span>
          <h2 className="text-5xl md:text-7xl font-serif text-[#1C1C1C] tracking-tight">
            Living <span className="italic">heritage</span>
          </h2>
        </div>
        <p className="text-[#1C1C1C]/50 text-sm max-w-sm font-medium leading-relaxed md:mt-10">
          Four GI-tagged craft traditions, each tied to a place you can actually visit — and to the artisans who keep it going.
        </p>
      </div>

      <div className="flex flex-col md:flex-row w-full h-[800px] md:h-[650px] gap-2 sm:gap-4">
        {CRAFT_TRADITIONS.map((craft, index) => {
          const isActive = activeIndex === index;

          return (
            <div
              key={craft.id}
              onClick={() => setActiveIndex(index)}
              className={`relative overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isActive
                  ? "flex-[3] md:flex-[4.5] cursor-default"
                  : "flex-[1] md:flex-[0.8] cursor-pointer group hover:opacity-95"
              }`}
            >
              <div
                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
                  isActive ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
              >
                <Image src={craft.image} alt={craft.name} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-500" />
                
                <div className="absolute top-6 left-0 right-0 flex justify-center">
                  <span className="text-white/60 font-mono text-xs">{craft.id}</span>
                </div>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <h3 
                    className="text-white font-serif text-2xl tracking-wide whitespace-nowrap"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                  >
                    {craft.name}
                  </h3>
                </div>

                <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                  <span className="text-[#D35234] text-[9px] font-bold uppercase tracking-[0.2em]">{craft.category}</span>
                </div>
              </div>

              <div
                className={`absolute inset-0 w-full h-full transition-opacity duration-700 delay-100 ${
                  isActive ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <Image src={craft.image} alt={craft.name} fill unoptimized className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

                <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h2 className="text-white/90 font-serif italic text-6xl md:text-[6rem] leading-none tracking-tight drop-shadow-lg">
                      {craft.id}
                    </h2>
                    <div className="px-4 py-2 border border-white/30 bg-black/20 backdrop-blur-md rounded-md">
                      <span className="text-white/80 text-[10px] uppercase tracking-[0.2em] font-mono font-bold">
                        GI TAG • {craft.giTag}
                      </span>
                    </div>
                  </div>

                  <div className="w-full max-w-lg">
                    <div className="flex items-center gap-3 text-[#D35234] text-[10px] uppercase tracking-[0.2em] font-bold mb-4 drop-shadow-md">
                      <span>{craft.category}</span>
                      <span className="w-1 h-1 rounded-full bg-[#D35234]" />
                      <span>{craft.state}</span>
                    </div>

                    <h3 className="text-4xl md:text-5xl font-serif text-white mb-4 leading-tight drop-shadow-lg">
                      {craft.name}
                    </h3>

                    <p className="text-white/80 text-sm md:text-base font-medium leading-relaxed mb-8 drop-shadow-md">
                      {craft.desc}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-white/20 pt-6">
                      <div className="flex items-center gap-2 text-[#F5F4F0] text-sm font-semibold">
                        <MapPin className="w-4 h-4 text-[#D35234]" />
                        <span>{craft.location}</span>
                      </div>

                      <Link href={`/destinations`} className="inline-flex items-center gap-2 bg-white text-[#1C1C1C] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#D35234] hover:text-white transition-colors shadow-xl">
                        <span>Explore the region</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
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