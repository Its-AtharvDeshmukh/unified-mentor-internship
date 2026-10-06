"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { geoMercator, geoPath } from "d3-geo";
import { LuxuryNavbar } from "@/components/ui/LuxuryNavbar";
import { 
  MapPin, 
  ArrowLeft, 
  ArrowUpRight, 
  Crosshair, 
  Compass, 
  Sparkles,
  Play,
  Pause,
  Search
} from "lucide-react";

/* ============================ TYPES & HELPERS ============================ */
type Entry = {
  name: string; place: string; title: string; tag: string; desc: string;
  image?: string; elevation?: string; coords?: string;
};
type City = Entry & { lat: number; lon: number };

const U = (id: string) => `https://images.unsplash.com/${id}?q=80&w=1600`;

const e = (name: string, place: string, title: string, tag: string, desc: string, x: Partial<Entry> = {}): Entry =>
  ({ name, place, title, tag, desc, ...x });

const c = (name: string, place: string, title: string, tag: string, lat: number, lon: number, desc: string, image?: string): City =>
  ({ name, place, title, tag, desc, lat, lon, image });

/* ============================ STATES DATA ============================ */
const STATES: Record<string, Entry> = {
  ladakh: e("Ladakh", "Pangong Tso", "Trans-Himalayan Tso", "High Altitude", "Crystalline azure water at 4,200 m, flanked by barren ridgelines that run into Tibet.", { image: U("photo-1581793745862-99fde7fa73d2"), elevation: "4,225 m", coords: "33.76° N, 78.67° E" }),
  jammuandkashmir: e("Jammu & Kashmir", "Dal Lake, Srinagar", "Dal Lake & Shikaras", "Valley of Paradise", "Houseboats, floating gardens and mirror-still dawns beneath the Pir Panjal.", { image: U("photo-1595815771614-ade9d652a65d") }),
  himachalpradesh: e("Himachal Pradesh", "Spiti Valley", "Spiti Cold Desert", "Mountain Desert", "Whitewashed monasteries perched above a moonlike high-altitude valley.", { image: U("photo-1626621341517-bbf3d9990a23") }),
  punjab: e("Punjab", "Amritsar", "The Golden Temple", "Sacred Gold", "A gilded sanctum floating on a sacred pool, glowing brightest after dusk.", { image: U("photo-1514222134-b57cbb8ce073") }),
  haryana: e("Haryana", "Kurukshetra", "Brahma Sarovar", "Epic Land", "A vast sacred tank on the land of the Mahabharata."),
  uttarakhand: e("Uttarakhand", "Valley of Flowers", "Valley of Flowers", "UNESCO Bloom", "A Himalayan meadow that erupts into wildflowers each monsoon.", { image: U("photo-1588668214407-6ea9a6d8c272") }),
  nctofdelhi: e("Delhi", "Humayun's Tomb", "Humayun's Tomb", "Mughal Grandeur", "The garden-tomb that inspired the Taj, in red sandstone and marble."),
  rajasthan: e("Rajasthan", "Jodhpur", "Mehrangarh Citadel", "Desert Bastion", "A 400-foot cliff fortress, the pinnacle of Rajput military architecture.", { image: U("photo-1582510003544-4d00b7f74220"), elevation: "122 m", coords: "26.30° N, 73.02° E" }),
  uttarpradesh: e("Uttar Pradesh", "Varanasi", "The Sacred Ghats", "Spiritual Epicenter", "Stone riverfront terraces where morning ablutions meet evening fire rituals.", { image: U("photo-1561361513-2d000a50f0dc"), elevation: "80.7 m", coords: "25.32° N, 83.01° E" }),
  bihar: e("Bihar", "Bodh Gaya", "Mahabodhi Temple", "Place of Awakening", "Where the Buddha attained enlightenment under the Bodhi tree."),
  sikkim: e("Sikkim", "Gurudongmar", "Kanchenjunga Skyline", "Third Highest Peak", "Prayer flags, alpine lakes and the world's third-highest summit at dawn.", { image: U("photo-1589308078059-be1415eab4c3") }),
  arunachalpradesh: e("Arunachal Pradesh", "Tawang", "Tawang Monastery", "Land of Dawn Sun", "India's largest monastery, wrapped in cloud above the eastern Himalaya."),
  nagaland: e("Nagaland", "Kohima", "Dzukou Valley", "Emerald Valley", "Rolling green ridges carpeted in seasonal lilies."),
  manipur: e("Manipur", "Loktak Lake", "Floating Phumdis", "Floating Wonder", "The world's only floating national park drifts on this vast lake."),
  mizoram: e("Mizoram", "Phawngpui", "Blue Mountain", "Hills of Mist", "Misty ridgelines and orchid-draped peaks."),
  tripura: e("Tripura", "Neermahal", "Neermahal Water Palace", "Lake Palace", "A royal summer palace rising from the middle of Rudrasagar Lake."),
  meghalaya: e("Meghalaya", "Cherrapunji", "Living Root Bridges", "Botanical Marvel", "Bridges grown from rubber fig roots over wild rivers in the wettest place on Earth.", { image: U("photo-1622308644420-a602e1c90554"), elevation: "1,484 m", coords: "25.27° N, 91.73° E" }),
  assam: e("Assam", "Kaziranga", "Kaziranga Grasslands", "One-Horned Rhino", "Misty floodplains sheltering two-thirds of the world's one-horned rhinos.", { image: U("photo-1575550959106-5a7defe28b56") }),
  westbengal: e("West Bengal", "Darjeeling", "Tea Gardens & Toy Train", "Queen of Hills", "A steam toy train winding through tea terraces, Kanchenjunga beyond.", { image: U("photo-1593693397690-362cb9666fc2") }),
  jharkhand: e("Jharkhand", "Hundru Falls", "Hundru Falls", "Land of Forests", "A 98 m cascade dropping through the Chota Nagpur plateau."),
  odisha: e("Odisha", "Konark", "Konark Sun Temple", "Chariot of the Sun", "A 13th-century temple built as a colossal stone chariot with 24 carved wheels.", { image: U("photo-1600100397608-f010f4439c63") }),
  chhattisgarh: e("Chhattisgarh", "Chitrakote", "Chitrakote Falls", "Niagara of India", "A wide horseshoe waterfall on the Indravati river."),
  madhyapradesh: e("Madhya Pradesh", "Khajuraho", "Khajuraho Temples", "Stone Poetry", "A thousand years of exquisitely carved sandstone temples.", { image: U("photo-1609137144813-7d9921338f24") }),
  gujarat: e("Gujarat", "Rann of Kutch", "White Rann", "Salt Desert", "An endless white salt desert that glows under the full moon.", { image: U("photo-1589308078059-be1415eab4c3") }),
  maharashtra: e("Maharashtra", "Ajanta & Ellora", "Ajanta & Ellora Caves", "Rock-Cut Wonder", "Monolithic temples and painted caves carved from basalt cliffs.", { image: U("photo-1570168007204-dfb528c6958f") }),
  telangana: e("Telangana", "Hyderabad", "Charminar & Golconda", "City of Pearls", "A 16th-century monument and a diamond-era fortress with remarkable acoustics.", { image: U("photo-1605649487212-47bdab064df7") }),
  andhrapradesh: e("Andhra Pradesh", "Araku Valley", "Araku & Borra Caves", "Eastern Ghats", "Coffee hills, mist and ancient limestone caves."),
  karnataka: e("Karnataka", "Hampi", "Hampi Monoliths", "Ancient Ruins", "A forgotten empire carved in golden granite across the Deccan plateau.", { image: U("photo-1600100397608-f010f4439c63"), elevation: "467 m", coords: "15.34° N, 76.46° E" }),
  goa: e("Goa", "Old Goa", "Churches & Coastline", "Susegad Shores", "Baroque basilicas, Portuguese quarters and palm-lined beaches.", { image: U("photo-1512343879784-a960bf40e7f2") }),
  kerala: e("Kerala", "Munnar", "Shola Cloud Forests", "Tropical Highlands", "Emerald tea estates piercing the clouds, home to the endangered Nilgiri Tahr.", { image: U("photo-1593693397690-362cb9666fc2"), elevation: "1,532 m", coords: "10.09° N, 77.06° E" }),
  tamilnadu: e("Tamil Nadu", "Madurai", "Meenakshi Temple", "Dravidian Splendour", "Towering gopurams crowded with thousands of painted deities.", { image: U("photo-1582510003544-4d00b7f74220") }),
  puducherry: e("Puducherry", "White Town", "French Quarter", "Riviera of the East", "Mustard-yellow colonial streets that end at the Bay of Bengal."),
  chandigarh: e("Chandigarh", "Rock Garden", "Nek Chand's Rock Garden", "Fantasy in Scrap", "A sculpture kingdom built from discarded and recycled materials."),
  andamanandnicobarislands: e("Andaman & Nicobar", "Radhanagar Beach", "Radhanagar Beach", "Island Paradise", "Powder-white sand and turquoise water on Havelock Island."),
  lakshadweep: e("Lakshadweep", "Agatti Lagoon", "Coral Lagoons", "Coral Atolls", "Glass-clear lagoons ringed by coral reefs in the Arabian Sea."),
  dadraandnagarhavelianddamananddiu: e("Dadra, Nagar Haveli, Daman & Diu", "Diu Fort", "Diu Fort", "Portuguese Coast", "A sea-washed Portuguese fort on a quiet island coast."),
};

const ALIASES: Record<string, string> = {
  delhi: "nctofdelhi", orissa: "odisha", uttaranchal: "uttarakhand",
  andamannicobar: "andamanandnicobarislands", andamanandnicobar: "andamanandnicobarislands",
  dadraandnagarhaveli: "dadraandnagarhavelianddamananddiu", damananddiu: "dadraandnagarhavelianddamananddiu",
  jammukashmir: "jammuandkashmir",
};

const norm = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z]/g, "");
const keyOf = (s: string) => ALIASES[norm(s)] ?? norm(s);

/* ============================ CITIES DATA ============================ */
const CITIES: City[] = [
  c("Leh", "Ladakh", "Shanti Stupa & Thiksey", "Roof of the World", 34.15, 77.58, "Whitewashed stupas and monasteries above a cold desert."),
  c("Pangong", "Ladakh", "Pangong Tso", "High Altitude", 33.76, 78.67, "Colour-shifting blue water at 4,225 m, ringed by barren ridges.", U("photo-1581793745862-99fde7fa73d2")),
  c("Srinagar", "J&K", "Dal Lake Shikaras", "Floating Gardens", 34.08, 74.8, "Painted boats drifting through lotus beds at sunrise."),
  c("Amritsar", "Punjab", "Harmandir Sahib", "Golden Temple", 31.62, 74.88, "Golden reflections on the sacred sarovar."),
  c("Shimla", "Himachal Pradesh", "Ridge & Toy Train", "Colonial Hills", 31.1, 77.17, "A Raj-era hill town reached by a UNESCO-listed mountain railway."),
  c("Rishikesh", "Uttarakhand", "Ganga Aarti at Triveni Ghat", "Yoga Capital", 30.09, 78.27, "Suspension bridges, ashrams and evening lamps on the upper Ganga."),
  c("Agra", "Uttar Pradesh", "The Taj Mahal", "Monument of Love", 27.18, 78.04, "White marble that shifts from pink to gold to silver through the day.", U("photo-1564507592333-c60657eea523")),
  c("Varanasi", "Uttar Pradesh", "Ganga Aarti at Dashashwamedh", "Oldest Living City", 25.32, 83.01, "Lamps, bells and chanting at dusk on the world's oldest living riverfront.", U("photo-1561361513-2d000a50f0dc")),
  c("Jaisalmer", "Rajasthan", "Golden Fort", "Living Fort", 26.92, 70.91, "A honey-coloured sandstone citadel rising from the Thar Desert.", U("photo-1548013146-72479768bada")),
  c("Jodhpur", "Rajasthan", "Mehrangarh Citadel", "Blue City", 26.3, 73.02, "A cliff fortress above a sea of indigo-painted houses.", U("photo-1582510003544-4d00b7f74220")),
  c("Udaipur", "Rajasthan", "Lake Pichola & City Palace", "City of Lakes", 24.58, 73.68, "White palaces mirrored in glassy lakes ringed by the Aravallis."),
  c("Bhuj", "Gujarat", "White Rann of Kutch", "Salt Desert", 23.25, 69.67, "An endless white salt flat that glows under the full moon.", U("photo-1589308078059-be1415eab4c3")),
  c("Mumbai", "Maharashtra", "Marine Drive at Dusk", "Queen's Necklace", 19.08, 72.88, "A curve of lights along the Arabian Sea beside Art Deco facades."),
  c("Aurangabad", "Maharashtra", "Ellora Kailasa Temple", "Rock-Cut Wonder", 19.88, 75.34, "A temple carved top-down from a single basalt cliff.", U("photo-1590050752117-238cb0fb12b1")),
  c("Goa", "Goa", "Basilica of Bom Jesus", "Susegad Shores", 15.5, 73.83, "Baroque churches, Portuguese quarters and palm-lined beaches.", U("photo-1512343879784-a960bf40e7f2")),
  c("Khajuraho", "Madhya Pradesh", "Khajuraho Temples", "Stone Poetry", 24.85, 79.92, "A thousand years of exquisitely carved sandstone temples.", U("photo-1609137144813-7d9921338f24")),
  c("Konark", "Odisha", "Konark Sun Temple", "Chariot of the Sun", 19.89, 86.1, "A temple built as a colossal stone chariot with 24 carved wheels.", U("photo-1600100397608-f010f4439c63")),
  c("Darjeeling", "West Bengal", "Tiger Hill Sunrise", "Queen of Hills", 27.04, 88.26, "First light striking the Kanchenjunga range.", U("photo-1593693397690-362cb9666fc2")),
  c("Kaziranga", "Assam", "Kaziranga Grasslands", "One-Horned Rhino", 26.58, 93.17, "Misty floodplains sheltering two-thirds of the world's one-horned rhinos.", U("photo-1575550959106-5a7defe28b56")),
  c("Cherrapunji", "Meghalaya", "Living Root Bridges", "Botanical Marvel", 25.27, 91.73, "Bridges grown from rubber fig roots over wild rivers.", U("photo-1622308644420-a602e1c90554")),
  c("Hampi", "Karnataka", "Vittala Stone Chariot", "UNESCO Site", 15.34, 76.46, "A shrine shaped like a chariot, among boulder-strewn ruins.", U("photo-1600100397608-f010f4439c63")),
  c("Madurai", "Tamil Nadu", "Meenakshi Temple", "Dravidian Splendour", 9.92, 78.12, "Towering gopurams crowded with thousands of painted deities.", U("photo-1582510003544-4d00b7f74220")),
  c("Munnar", "Kerala", "Tea Estates in the Clouds", "Tropical Highlands", 10.09, 77.06, "Emerald terraces above the cloud line.", U("photo-1593693397690-362cb9666fc2")),
  c("Alleppey", "Kerala", "Backwater Houseboats", "Venice of the East", 9.49, 76.33, "Slow kettuvallams gliding past paddy fields and palms."),
];

/* ============================ ANIMATIONS CSS ============================ */
const CSS = `
.radar-sweep{position:absolute;inset:-4%;border-radius:9999px;pointer-events:none;background:conic-gradient(from 0deg,rgba(211,82,52,.22),transparent 28%);-webkit-mask-image:radial-gradient(circle,#000 30%,transparent 72%);mask-image:radial-gradient(circle,#000 30%,transparent 72%);animation:sweep 9s linear infinite}
@keyframes sweep{to{transform:rotate(360deg)}}
.map-glow{position:absolute;inset:0;pointer-events:none;background:radial-gradient(280px circle at var(--mx,40%) var(--my,50%),rgba(211,82,52,.16),transparent 70%)}
.state-in{opacity:0;animation:stateIn .9s ease-out forwards}
@keyframes stateIn{to{opacity:1}}
.pin{transform-box:fill-box;transform-origin:center;opacity:0;animation:pinDrop .6s cubic-bezier(.2,1.4,.4,1) forwards}
@keyframes pinDrop{from{opacity:0;transform:translateY(-18px) scale(.2)}to{opacity:1;transform:none}}
.pin-ring{fill:none;stroke:#D35234;stroke-width:1;transform-box:fill-box;transform-origin:center;opacity:0;animation:ring 3.6s ease-out infinite}
@keyframes ring{0%{opacity:.7;transform:scale(1)}100%{opacity:0;transform:scale(5)}}
.dossier>*{opacity:0;animation:rise .75s cubic-bezier(.16,1,.3,1) forwards}
.dossier>*:nth-child(1){animation-delay:.04s}.dossier>*:nth-child(2){animation-delay:.1s}.dossier>*:nth-child(3){animation-delay:.16s}.dossier>*:nth-child(4){animation-delay:.24s}.dossier>*:nth-child(5){animation-delay:.32s}.dossier>*:nth-child(6){animation-delay:.4s}.dossier>*:nth-child(7){animation-delay:.48s}
@keyframes rise{from{opacity:0;transform:translateY(18px);filter:blur(6px)}to{opacity:1;transform:none;filter:none}}
.kenburns{animation:kb 12s ease-in-out infinite alternate}
@keyframes kb{from{transform:scale(1)}to{transform:scale(1.12) translate(-1.5%,-1%)}}
.tour-bar{height:2px;background:#D35234;transform-origin:left;animation:bar 4s linear forwards}
@keyframes bar{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@media (prefers-reduced-motion:reduce){.state-in,.pin,.dossier>*{opacity:1!important;animation:none!important}.radar-sweep,.pin-ring,.kenburns,.tour-bar{animation:none!important}}
`;

/* ============================ MAP LOADER ============================ */
const W = 800;
const H = 900;
const GEO_SOURCES = [
  "/data/india-states.geojson",
  "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@main/geojson/india.geojson",
];

async function loadGeo() {
  for (const url of GEO_SOURCES) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch {}
  }
  return null;
}

const stateNameOf = (f: any) => {
  const p = f.properties || {};
  return p.st_nm || p.ST_NM || p.NAME_1 || p.name || p.NAME || p.state || "";
};

/* ============================ PAGE ============================ */
export default function IndiaMapPage() {
  const [geo, setGeo] = useState<any>(null);
  const [failed, setFailed] = useState(false);
  const [hoverState, setHoverState] = useState<string | null>(null);
  const [hoverCity, setHoverCity] = useState<string | null>(null);
  const [active, setActive] = useState<Entry & { kind: "state" | "city" }>({ ...STATES.uttarpradesh, kind: "state" });
  const [activeKey, setActiveKey] = useState("uttarpradesh");
  const [tour, setTour] = useState(true);
  const [inside, setInside] = useState(false);

  const auto = tour && !inside;
  const tourIdx = useRef(0);

  useEffect(() => {
    loadGeo().then((g) => (g ? setGeo(g) : setFailed(true)));
  }, []);

  const { paths, project } = useMemo(() => {
    if (!geo) return { paths: [] as any[], project: null as any };
    const projection = geoMercator().fitExtent([[30, 30], [W - 30, H - 30]], geo);
    const gp = geoPath(projection);
    return {
      project: projection,
      paths: geo.features.map((f: any) => ({ key: keyOf(stateNameOf(f)), d: gp(f) || "" })),
    };
  }, [geo]);

  const pickState = (key: string) => {
    const s = STATES[key];
    if (!s) return;
    setHoverState(key);
    setActive({ ...s, kind: "state" });
    setActiveKey(key);
  };

  const pickCity = (ct: City) => {
    setHoverCity(ct.name);
    setActive({ ...ct, kind: "city" });
    setActiveKey("city:" + ct.name);
  };

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => pickCity(CITIES[tourIdx.current++ % CITIES.length]), 4000);
    return () => clearInterval(t);
  }, [auto]);

  const onMove = (ev: React.MouseEvent<HTMLElement>) => {
    const r = ev.currentTarget.getBoundingClientRect();
    ev.currentTarget.style.setProperty("--mx", `${ev.clientX - r.left}px`);
    ev.currentTarget.style.setProperty("--my", `${ev.clientY - r.top}px`);
  };

  // Safe routing logic depending on entity type
  const targetLink = active.kind === "state" 
    ? `/states/${active.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`
    : `/search?q=${encodeURIComponent(active.name)}`;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0A0A] font-sans text-white selection:bg-[#D35234]">
      <style>{CSS}</style>
      <LuxuryNavbar />
      
      {/* Background Cartographic Overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.15] [background:linear-gradient(rgba(255,255,255,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px)] [background-size:60px_60px]" />
      <div className="pointer-events-none absolute left-[30%] top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D35234]/10 blur-[160px]" />

      {/* Floating HUD Controls */}
      <div className="absolute left-6 top-32 lg:top-28 z-40 flex items-center gap-4 lg:left-12">
        <Link 
          href="/" 
          className="group flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] backdrop-blur-xl transition hover:bg-white/15 hover:border-white/20 shadow-lg"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Return
        </Link>
        <button 
          onClick={() => setTour((t) => !t)} 
          className="group flex items-center gap-2.5 rounded-full border border-[#D35234]/30 bg-[#D35234]/10 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#E8956F] backdrop-blur-xl transition hover:bg-[#D35234]/20 shadow-lg"
        >
          {tour ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {tour ? "Pause Tour" : "Auto-Tour"}
        </button>
      </div>

      <div className="relative z-10 flex min-h-screen flex-col pt-44 lg:flex-row lg:items-center lg:pt-24">
        
        {/* ============ MAP VIEWPORT ============ */}
        <section onMouseMove={onMove} className="relative flex flex-1 items-center justify-center px-4 lg:pl-16">
          <div className="map-glow" />
          <div className="relative w-full max-w-[720px]">
            <div className="radar-sweep" />
            
            {!geo && !failed && (
              <p className="absolute inset-0 grid place-items-center font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 animate-pulse">
                Calibrating Cartography...
              </p>
            )}
            
            {failed && (
              <p className="absolute inset-0 grid place-items-center px-6 text-center font-mono text-[10px] uppercase tracking-widest text-red-400">
                Map topology unavailable. Ensure /public/data/india-states.geojson exists.
              </p>
            )}

            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="relative h-auto w-full drop-shadow-2xl"
              onMouseEnter={() => setInside(true)}
              onMouseLeave={() => { setInside(false); setHoverState(null); setHoverCity(null); }}
            >
              <g>
                {paths.map((p: any, i: number) => {
                  const on = hoverState === p.key || activeKey === p.key;
                  const known = !!STATES[p.key];
                  return (
                    <path
                      key={p.key + i}
                      d={p.d}
                      onMouseEnter={() => known && pickState(p.key)}
                      onClick={() => known && pickState(p.key)}
                      className="state-in cursor-pointer transition-[fill,stroke,stroke-width] duration-500"
                      fill={on ? "rgba(211,82,52,0.6)" : "rgba(255,255,255,0.03)"}
                      stroke={on ? "#E8956F" : "rgba(255,255,255,0.15)"}
                      strokeWidth={on ? 1.5 : 0.8}
                      style={{ animationDelay: `${i * 20}ms`, filter: on ? "drop-shadow(0 0 16px rgba(211,82,52,.5))" : undefined }}
                    />
                  );
                })}
              </g>
              
              {project &&
                CITIES.map((ct, i) => {
                  const pt = project([ct.lon, ct.lat]);
                  if (!pt) return null;
                  const [x, y] = pt;
                  const on = hoverCity === ct.name || activeKey === "city:" + ct.name;
                  return (
                    <g key={ct.name} transform={`translate(${x},${y})`} className="cursor-crosshair" onMouseEnter={() => pickCity(ct)} onClick={() => pickCity(ct)}>
                      <g className="pin" style={{ animationDelay: `${800 + i * 40}ms` }}>
                        <circle r={16} fill="transparent" />
                        <circle r={4} className="pin-ring" style={{ animationDelay: `${(i % 8) * 300}ms` }} />
                        {on && <circle r={14} fill="none" stroke="#D35234" strokeWidth={1.5} className="animate-ping" />}
                        <circle r={on ? 6 : 3.5} fill={on ? "#E8956F" : "#fff"} fillOpacity={on ? 1 : 0.6} className="transition-all duration-300" />
                        {on && (
                          <text y={-14} textAnchor="middle" className="fill-white font-serif tracking-wide" fontSize={14} style={{ paintOrder: "stroke", stroke: "#000", strokeWidth: 4 }}>
                            {ct.name}
                          </text>
                        )}
                      </g>
                    </g>
                  );
                })}
            </svg>
            
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
              <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-sm bg-[#D35234]/80" /> Territorial Bound</span>
              <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-white/70" /> Geolocation Node</span>
              <span>{CITIES.length} Nodes Indexed</span>
            </div>
          </div>
        </section>

        {/* ============ EDITORIAL DOSSIER ============ */}
        <aside className="w-full px-4 pb-12 lg:w-[45%] lg:pr-12">
          <div key={activeKey} className="dossier mx-auto w-full max-w-xl rounded-[3rem] border border-white/10 bg-[#121212]/80 p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,.6)] backdrop-blur-3xl relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D35234]/10 rounded-bl-full blur-2xl pointer-events-none" />

            <div className="mb-4 flex items-center gap-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#D35234]">
              <Sparkles className="h-3.5 w-3.5" />
              {active.kind === "city" ? "Geolocated Coordinate" : "Geopolitical Territory"}
            </div>
            
            <h1 className="mb-3 font-serif text-5xl font-light leading-[0.95] tracking-tight text-white">
              {active.title}
            </h1>
            
            <p className="mb-8 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#E8956F]">
              <MapPin className="h-3.5 w-3.5" /> {active.kind === "city" ? `${active.name}, ${active.place}` : `${active.place}, ${active.name}`}
            </p>

            <div className="relative mb-8 aspect-[16/10] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
              {active.image ? (
                <Image src={active.image} alt={active.title} fill unoptimized className="kenburns object-cover" />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#D35234_0%,#3a1a12_45%,#0a0a0a_100%)]">
                  <span className="absolute inset-0 grid place-items-center px-6 text-center font-serif text-3xl font-light text-white/90">{active.name}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />
              <span className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] backdrop-blur-md text-white shadow-lg">
                {active.tag}
              </span>
              {auto && <div key={activeKey} className="tour-bar absolute bottom-0 left-0 w-full" />}
            </div>

            {(active.coords || active.elevation) ? (
              <div className="mb-8 grid grid-cols-2 gap-4">
                {active.coords && (
                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 sm:p-5">
                    <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-widest text-white/40">Coordinates</span>
                    <span className="flex items-center gap-2 font-mono text-xs font-semibold"><Crosshair className="h-3.5 w-3.5 text-[#D35234]" />{active.coords}</span>
                  </div>
                )}
                {active.elevation && (
                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 sm:p-5">
                    <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-widest text-white/40">Elevation</span>
                    <span className="flex items-center gap-2 font-mono text-xs font-semibold"><Compass className="h-3.5 w-3.5 text-sky-400" />{active.elevation}</span>
                  </div>
                )}
              </div>
            ) : null}
            
            <p className="mb-10 text-sm sm:text-base font-medium leading-relaxed text-white/75 border-l-2 border-white/10 pl-5">
              {active.desc}
            </p>

            <Link 
              href={targetLink} 
              className="group flex w-full items-center justify-between rounded-2xl bg-white px-7 py-4.5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-black shadow-xl transition-all hover:bg-[#D35234] hover:text-white"
            >
              <span className="flex items-center gap-3">
                {active.kind === "city" ? <Search className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                {active.kind === "city" ? `Search ${active.name} Index` : `Explore State Dossier`}
              </span>
              <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </Link>
          </div>
        </aside>
        
      </div>
    </main>
  );
}