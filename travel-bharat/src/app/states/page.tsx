import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { LuxuryNavbar } from "@/components/ui/LuxuryNavbar";
import { MapPin, ArrowRight, Sparkles, Compass } from "lucide-react";

export const metadata = {
  title: "The Geopolitical Atlas • 28 States & 8 UTs | TravelBharat",
  description: "Explore India through an editorial geographic lens across all regional zones.",
};

const DEFAULT_STATES = [
  {
    name: "Rajasthan",
    slug: "rajasthan",
    capital: "Jaipur",
    region: "North India",
    heroImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200",
    shortDescription: "Living desert citadels, Rajput fortresses, and vibrant royal craftsmanship.",
    sitesCount: 18,
  },
  {
    name: "Uttar Pradesh",
    slug: "uttar-pradesh",
    capital: "Lucknow",
    region: "North India",
    heroImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1200",
    shortDescription: "The sacred Ganga basin, eternal Varanasi ghats, and Mughal architectural monuments.",
    sitesCount: 24,
  },
  {
    name: "Karnataka",
    slug: "karnataka",
    capital: "Bengaluru",
    region: "South India",
    heroImage: "https://images.unsplash.com/photo-1600100397608-f010f4439c63?q=80&w=1200",
    shortDescription: "Deccan plateau granite boulder plains and monolithic Vijayanagara ruins.",
    sitesCount: 16,
  },
  {
    name: "Kerala",
    slug: "kerala",
    capital: "Thiruvananthapuram",
    region: "South India",
    heroImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200",
    shortDescription: "Tropical shola cloud forests, backwater lagoons, and spice hills across the Western Ghats.",
    sitesCount: 14,
  },
  {
    name: "Ladakh",
    slug: "ladakh",
    capital: "Leh",
    region: "North India",
    heroImage: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=1200",
    shortDescription: "High-altitude desert passes, azure glacial lakes, and cliffside Buddhist gompas.",
    sitesCount: 11,
  },
  {
    name: "Himachal Pradesh",
    slug: "himachal-pradesh",
    capital: "Shimla",
    region: "North India",
    heroImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1200",
    shortDescription: "Trans-Himalayan valleys, snowcapped mountain ridges, and apple orchards.",
    sitesCount: 15,
  },
  {
    name: "Meghalaya",
    slug: "meghalaya",
    capital: "Shillong",
    region: "Northeast India",
    heroImage: "https://images.unsplash.com/photo-1622308644420-a602e1c90554?q=80&w=1200",
    shortDescription: "High cloud plateaus, double-decker living root bridges, and rainfall canyons.",
    sitesCount: 9,
  },
  {
    name: "Assam",
    slug: "assam",
    capital: "Dispur",
    region: "Northeast India",
    heroImage: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?q=80&w=1200",
    shortDescription: "Brahmaputra alluvial floodplains and the sanctuary of the Great One-Horned Rhino.",
    sitesCount: 12,
  },
  {
    name: "Odisha",
    slug: "odisha",
    capital: "Bhubaneswar",
    region: "East India",
    heroImage: "https://images.unsplash.com/photo-1600100397608-f010f4439c63?q=80&w=1200",
    shortDescription: "Kalinga stone temples, celestial sun chariots, and sacred coastal shrines.",
    sitesCount: 14,
  },
  {
    name: "Maharashtra",
    slug: "maharashtra",
    capital: "Mumbai",
    region: "West India",
    heroImage: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=1200",
    shortDescription: "Basalt rock-cut cave temples, Maratha hill forts, and Arabian sea coastlines.",
    sitesCount: 22,
  },
  {
    name: "Gujarat",
    slug: "gujarat",
    capital: "Gandhinagar",
    region: "West India",
    heroImage: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=1200",
    shortDescription: "White salt expanse of Kutch, stepwells, and the last Asiatic lion sanctuaries.",
    sitesCount: 17,
  },
  {
    name: "Tamil Nadu",
    slug: "tamil-nadu",
    capital: "Chennai",
    region: "South India",
    heroImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200",
    shortDescription: "Living Chola stone temples, towering sculpted gopurams, and classical arts.",
    sitesCount: 26,
  },
];

export default async function StatesIndexPage() {
  let dbStates: any[] = [];
  try {
    dbStates = await prisma.state.findMany({
      include: { _count: { select: { touristPlaces: true } } },
      orderBy: { name: "asc" },
    });
  } catch {}

  const states = dbStates.length > 0
    ? dbStates.map((s) => ({
        name: s.name,
        slug: s.slug,
        capital: s.capital,
        region: s.region,
        heroImage: s.heroImage,
        shortDescription: s.shortDescription,
        sitesCount: s._count?.touristPlaces || 0,
      }))
    : DEFAULT_STATES;

  return (
    <main className="bg-[#FAF8F5] text-[#1A1A1A] min-h-screen font-sans selection:bg-[#D35234] selection:text-white">
      <LuxuryNavbar />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-36 pb-28">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 pb-10 border-b border-black/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D35234]/10 text-[#D35234] text-[10px] font-mono font-bold uppercase tracking-[0.25em] mb-4">
              <Compass className="w-3.5 h-3.5" /> 01 • Geopolitical Register
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-light tracking-tight text-[#1A1A1A] leading-[0.98]">
              States & <span className="italic text-black/60">Territories.</span>
            </h1>
            <p className="text-black/65 text-base md:text-lg mt-4 font-medium leading-relaxed max-w-xl">
              Explore 28 federated states and 8 union territories organized through an editorial geographic lens. Click any state to inspect its verified regional destinations.
            </p>
          </div>

          <span className="font-mono text-xs uppercase tracking-widest px-4 py-2 rounded-full bg-white border border-black/10 shadow-sm font-bold text-[#D35234]">
            {states.length} Regional Jurisdictions
          </span>
        </div>

        {/* States Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {states.map((state) => (
            <Link
              key={state.slug}
              href={`/states/${state.slug}`}
              className="group relative flex flex-col justify-between rounded-[2.5rem] overflow-hidden bg-white border border-black/5 shadow-xl hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#1A1A1A]">
                <Image
                  src={state.heroImage}
                  alt={state.name}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                <div className="absolute top-4 left-4">
                  <span className="px-3.5 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-mono font-bold uppercase tracking-widest text-[#E8956F] border border-white/10">
                    {state.region}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white font-mono text-xs">
                  <span className="text-white/80">Capital: {state.capital}</span>
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold">
                    {state.sitesCount} Sites
                  </span>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-3xl font-serif font-light text-[#1A1A1A] group-hover:text-[#D35234] transition-colors">
                    {state.name}
                  </h3>
                  <p className="text-sm text-black/60 font-medium mt-2 line-clamp-2 leading-relaxed">
                    {state.shortDescription}
                  </p>
                </div>
                <div className="pt-4 border-t border-black/10 flex items-center justify-between font-mono text-xs uppercase tracking-widest text-[#D35234] font-bold">
                  <span>Open State Dossier</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}