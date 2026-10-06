"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Landmark, 
  ArrowUpRight, 
  MapPin, 
  Compass, 
  ChevronRight
} from "lucide-react";

interface UNESCOEntry {
  id: string;
  serial: string;
  name: string;
  slug: string;
  state: string;
  year: string;
  type: "Cultural" | "Natural";
  criteria: string;
  altitude: string;
  coordinates: string;
  description: string;
  image: string;
}

const UNESCO_VAULT: UNESCOEntry[] = [
  {
    id: "01",
    serial: "WHC-1983-0252",
    name: "Taj Mahal Complex",
    slug: "taj-mahal",
    state: "Uttar Pradesh",
    year: "1983",
    type: "Cultural",
    criteria: "Criterion (i)",
    altitude: "171 m",
    coordinates: "27.1751° N, 78.0421° E",
    description: "Commissioned by Shah Jahan in 1632, the octagonal mausoleum represents the zenith of Mughal symmetry, featuring floral relief pietre dure stonework along the Yamuna riverfront.",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1600",
  },
  {
    id: "02",
    serial: "WHC-1984-0246",
    name: "Sun Temple Konark",
    slug: "konark-sun-temple",
    state: "Odisha",
    year: "1984",
    type: "Cultural",
    criteria: "Criteria (i)(iii)(vi)",
    altitude: "12 m",
    coordinates: "19.8876° N, 86.0945° E",
    description: "Constructed in 1250 CE by King Narasimhadeva I, the temple forms a monumental cosmic chariot with 24 carved stone wheels that calculate accurate time based on sun-cast shadows.",
    image: "https://images.unsplash.com/photo-1600100397608-f010f4439c63?q=80&w=1600",
  },
  {
    id: "03",
    serial: "WHC-1986-0241",
    name: "Hampi Monuments",
    slug: "hampi-monuments",
    state: "Karnataka",
    year: "1986",
    type: "Cultural",
    criteria: "Criteria (i)(iii)(iv)",
    altitude: "467 m",
    coordinates: "15.3350° N, 76.4600° E",
    description: "Spanning 4,100 hectares of rugged Deccan boulder terrain, Hampi comprises 1,600 surviving monuments, including chariot shrines, musical pillared halls, and royal elephant pavilions.",
    image: "https://images.unsplash.com/photo-1600100397608-f010f4439c63?q=80&w=1600",
  },
  {
    id: "04",
    serial: "WHC-1985-0337",
    name: "Kaziranga Grasslands",
    slug: "kaziranga-national-park",
    state: "Assam",
    year: "1985",
    type: "Natural",
    criteria: "Criteria (ix)(x)",
    altitude: "80 m",
    coordinates: "26.5775° N, 93.1711° E",
    description: "A pristine floodplain wetland along the Brahmaputra River hosting two-thirds of the planet's remaining Great Indian One-Horned Rhinoceroses alongside tigers, elephants, and rare wetland flora.",
    image: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?q=80&w=1600",
  },
  {
    id: "05",
    serial: "WHC-1983-0242",
    name: "Ellora Kailasa Complex",
    slug: "ellora-caves",
    state: "Maharashtra",
    year: "1983",
    type: "Cultural",
    criteria: "Criteria (i)(iii)(vi)",
    altitude: "570 m",
    coordinates: "20.0268° N, 75.1792° E",
    description: "The world's largest monolithic rock-cut structure, carved from a single volcanic cliff face from the top down by Rashtrakuta artisans without scaffolding or separate masonry blocks.",
    image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1600",
  },
];

export function UNESCOHeritage() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const current = UNESCO_VAULT[selectedIdx];

  return (
    <section id="unesco" className="py-28 px-6 lg:px-12 max-w-[1440px] mx-auto scroll-mt-24">
      {/* Top Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-black/10 pb-8">
        <div>
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#D35234]/10 text-[#D35234] text-[10px] font-mono font-bold uppercase tracking-[0.25em] mb-4">
            <Landmark className="w-3.5 h-3.5" /> UNESCO Sovereign Register
          </div>
          <h2 className="text-4xl md:text-6xl font-serif font-light text-[#1C1C1C] tracking-tight leading-tight">
            World Heritage <span className="italic text-[#1C1C1C]/60">Sanctuaries.</span>
          </h2>
        </div>
        <p className="text-[#1C1C1C]/65 text-sm max-w-md font-medium leading-relaxed">
          42 sovereign cultural and natural monuments certified under the UNESCO convention for exceptional universal significance to human civilization.
        </p>
      </div>

      {/* Dual-Pane Viewport & Curatorial Index */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Pane: Master Viewport (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-[3rem] overflow-hidden bg-[#0E0D0C] text-white p-8 md:p-12 shadow-2xl relative min-h-[580px]">
          <div className="absolute inset-0 z-0">
            <Image
              src={current.image}
              alt={current.name}
              fill
              unoptimized
              className="object-cover opacity-60 transition-all duration-1000 ease-out scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0D0C] via-[#0E0D0C]/40 to-black/30" />
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#E8956F] font-bold">
              {current.serial}
            </span>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/70">
              <Compass className="w-3.5 h-3.5 text-[#D35234]" />
              <span>{current.coordinates}</span>
            </div>
          </div>

          <div className="relative z-10 my-10 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#E8956F]">
              <MapPin className="w-4 h-4 text-[#D35234]" />
              <span>{current.state} • Inscribed {current.year}</span>
            </div>
            <h3 className="text-4xl md:text-6xl font-serif font-light text-white leading-tight">
              {current.name}
            </h3>
            <p className="text-sm md:text-base text-white/80 max-w-xl font-medium leading-relaxed">
              {current.description}
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/15">
            <div className="flex items-center gap-4 text-xs font-mono text-white/60">
              <span>Elev: {current.altitude}</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">{current.criteria}</span>
            </div>
            <Link
              href={`/destinations/${current.slug}`}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#D35234] hover:bg-white hover:text-black text-white text-xs font-bold uppercase tracking-widest transition-all shadow-xl shadow-[#D35234]/30"
            >
              <span>Examine Dossier</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Pane: Archival Selector Ledger (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
          {UNESCO_VAULT.map((item, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedIdx(idx)}
                className={`w-full text-left p-5 rounded-[2rem] transition-all duration-300 border flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? "bg-white border-[#D35234]/40 shadow-xl scale-[1.02]"
                    : "bg-white/60 hover:bg-white border-black/5 hover:border-black/10"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`font-mono text-xs font-bold ${isSelected ? "text-[#D35234]" : "text-black/30"}`}>
                    {item.id}
                  </span>
                  <div>
                    <h4 className="font-serif text-lg text-[#1C1C1C] font-normal leading-snug">
                      {item.name}
                    </h4>
                    <p className="text-[11px] font-mono uppercase tracking-widest text-black/50 mt-0.5">
                      {item.state} • {item.year}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full ${
                    isSelected ? "bg-[#D35234]/10 text-[#D35234] font-bold" : "bg-black/5 text-black/50"
                  }`}>
                    {item.type}
                  </span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? "text-[#D35234] translate-x-1" : "text-black/20"}`} />
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}