import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { LuxuryNavbar } from "@/components/ui/LuxuryNavbar";
import { ArrowRight, Compass, Search, Layers } from "lucide-react";

export const metadata = {
  title: "The Geopolitical Atlas • 28 States & 8 UTs | TravelBharat",
  description: "Explore India through an editorial geographic lens across all regional zones.",
};

interface StateRecord {
  name: string;
  slug: string;
  capital: string;
  region: string;
  heroImage: string;
  shortDescription: string;
  sitesCount: number;
}

const MASTER_STATES_DIRECTORY: StateRecord[] = [
  // North India
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
    name: "Jammu & Kashmir",
    slug: "jammu-and-kashmir",
    capital: "Srinagar",
    region: "North India",
    heroImage: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=1200",
    shortDescription: "Misty pine valleys, Shikara houseboats on Dal Lake, and Mughal pleasure gardens.",
    sitesCount: 16,
  },
  {
    name: "Punjab",
    slug: "punjab",
    capital: "Chandigarh",
    region: "North India",
    heroImage: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?q=80&w=1200",
    shortDescription: "The golden sanctum of Amritsar, fertile river plains, and historic battlements.",
    sitesCount: 10,
  },
  {
    name: "Uttarakhand",
    slug: "uttarakhand",
    capital: "Dehradun",
    region: "North India",
    heroImage: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=1200",
    shortDescription: "Glacial river sources, alpine flower meadows, and ancient Garhwal pilgrimage routes.",
    sitesCount: 14,
  },

  // South India
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
    name: "Tamil Nadu",
    slug: "tamil-nadu",
    capital: "Chennai",
    region: "South India",
    heroImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200",
    shortDescription: "Living Chola stone temples, towering sculpted gopurams, and classical arts.",
    sitesCount: 26,
  },
  {
    name: "Telangana",
    slug: "telangana",
    capital: "Hyderabad",
    region: "South India",
    heroImage: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=1200",
    shortDescription: "Historic Golconda diamond bastions, Charminar bazaars, and Kakatiya stone arches.",
    sitesCount: 12,
  },
  {
    name: "Goa",
    slug: "goa",
    capital: "Panaji",
    region: "South India",
    heroImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200",
    shortDescription: "Portuguese colonial quarters, UNESCO baroque basilicas, and palm-fringed coastlines.",
    sitesCount: 9,
  },

  // West India
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
    shortDescription: "White salt expanse of Kutch, ancient stepwells, and the last Asiatic lion sanctuaries.",
    sitesCount: 17,
  },

  // East & Central India
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
    name: "West Bengal",
    slug: "west-bengal",
    capital: "Kolkata",
    region: "East India",
    heroImage: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1200",
    shortDescription: "Himalayan tea estates of Darjeeling, terracotta shrines, and the Sundarbans mangrove delta.",
    sitesCount: 19,
  },
  {
    name: "Madhya Pradesh",
    slug: "madhya-pradesh",
    capital: "Bhopal",
    region: "Central India",
    heroImage: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=1200",
    shortDescription: "Khajuraho sandstone temples, ancient Sanchi stupas, and royal tiger reserves.",
    sitesCount: 18,
  },

  // Northeast India
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
    name: "Meghalaya",
    slug: "meghalaya",
    capital: "Shillong",
    region: "Northeast India",
    heroImage: "https://images.unsplash.com/photo-1622308644420-a602e1c90554?q=80&w=1200",
    shortDescription: "High cloud plateaus, double-decker living root bridges, and rainfall canyons.",
    sitesCount: 9,
  },
  {
    name: "Sikkim",
    slug: "sikkim",
    capital: "Gangtok",
    region: "Northeast India",
    heroImage: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=1200",
    shortDescription: "Glacial passes, alpine rhododendron sanctuaries, and sunrise views of Kangchenjunga.",
    sitesCount: 10,
  },
];

const REGION_TABS = [
  "All",
  "North India",
  "South India",
  "West India",
  "East India",
  "Northeast India",
  "Central India",
];

export default async function StatesIndexPage({
  searchParams,
}: {
  searchParams?: Promise<{ region?: string; q?: string }>;
}) {
  // Await searchParams per Next.js 15+ asynchronous convention
  const resolvedParams = searchParams ? await searchParams : {};
  const activeRegion = resolvedParams.region || "All";
  const searchQuery = resolvedParams.q?.toLowerCase().trim() || "";

  let dbStates: any[] = [];
  try {
    dbStates = await prisma.state.findMany({
      include: { _count: { select: { touristPlaces: true } } },
      orderBy: { name: "asc" },
    });
  } catch {}

  // Merge database states with default directory so DB counts and additions appear live
  const mergedMap = new Map<string, StateRecord>();

  MASTER_STATES_DIRECTORY.forEach((state) => {
    mergedMap.set(state.slug, { ...state });
  });

  dbStates.forEach((dbState) => {
    const existing = mergedMap.get(dbState.slug);
    if (existing) {
      existing.sitesCount = Math.max(existing.sitesCount, dbState._count?.touristPlaces || 1);
      if (dbState.heroImage) existing.heroImage = dbState.heroImage;
      if (dbState.description) existing.shortDescription = dbState.shortDescription || existing.shortDescription;
    } else {
      mergedMap.set(dbState.slug, {
        name: dbState.name,
        slug: dbState.slug,
        capital: dbState.capital || "Administrative Center",
        region: dbState.region || "Central India",
        heroImage: dbState.heroImage || "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=1200",
        shortDescription: dbState.shortDescription || `Explore the heritage of ${dbState.name}.`,
        sitesCount: dbState._count?.touristPlaces || 1,
      });
    }
  });

  const allStates = Array.from(mergedMap.values());

  // Filter based on selected region tab and search query
  const filteredStates = allStates.filter((st) => {
    const matchesRegion =
      activeRegion === "All" ||
      st.region.toLowerCase().includes(activeRegion.toLowerCase()) ||
      (activeRegion === "Northeast" && st.region.toLowerCase().includes("northeast"));

    const matchesSearch =
      !searchQuery ||
      st.name.toLowerCase().includes(searchQuery) ||
      st.capital.toLowerCase().includes(searchQuery) ||
      st.region.toLowerCase().includes(searchQuery);

    return matchesRegion && matchesSearch;
  });

  return (
    <main className="bg-[#FAF8F5] text-[#1A1A1A] min-h-screen font-sans antialiased selection:bg-[#D35234] selection:text-white">
      <LuxuryNavbar />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-36 pb-28">

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8 pb-10 border-b border-black/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D35234]/10 text-[#D35234] text-[10px] font-mono font-bold uppercase tracking-[0.25em] mb-4">
              <Compass className="w-3.5 h-3.5" /> 01 • Geopolitical Register
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-light tracking-tight text-[#1A1A1A] leading-[0.98]">
              States & <span className="italic text-black/60">Territories.</span>
            </h1>
            <p className="text-black/65 text-base md:text-lg mt-5 font-medium leading-relaxed max-w-xl">
              Discover 28 states and 8 union territories organized through an editorial geographic lens. Click any state to inspect its verified regional monuments.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <span className="font-mono text-xs uppercase tracking-widest px-4 py-2 rounded-full bg-white border border-black/10 shadow-sm font-bold text-[#D35234]">
              {filteredStates.length} Regions Displayed
            </span>
          </div>
        </div>

        {/* Interactive Regional Filter Tabs */}
        <div className="flex items-center gap-2 pb-8 overflow-x-auto no-scrollbar">
          {REGION_TABS.map((tab) => {
            const isTabActive =
              activeRegion.toLowerCase() === tab.toLowerCase() ||
              (tab === "All" && activeRegion === "All") ||
              (tab === "Northeast India" && activeRegion.toLowerCase() === "northeast");

            return (
              <Link
                key={tab}
                href={tab === "All" ? "/states" : `/states?region=${encodeURIComponent(tab)}`}
                className={`px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest font-semibold transition-all shrink-0 border ${
                  isTabActive
                    ? "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md"
                    : "bg-white text-black/60 border-black/10 hover:border-black/30 hover:text-black"
                }`}
              >
                {tab}
              </Link>
            );
          })}
        </div>

        {/* States Dossier Grid */}
        {filteredStates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStates.map((state) => (
              <Link
                key={state.slug}
                href={`/states/${state.slug}`}
                className="group relative flex flex-col justify-between rounded-[2.5rem] overflow-hidden bg-white border border-black/5 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                {/* Visual Imagery */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#1A1A1A]">
                  <Image
                    src={state.heroImage}
                    alt={state.name}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3.5 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-mono font-bold uppercase tracking-widest text-[#E8956F] border border-white/10">
                      {state.region}
                    </span>
                  </div>

                  {/* Bottom Image Strip */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white font-mono text-xs">
                    <span className="text-white/80">Capital: {state.capital}</span>
                    <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold">
                      {state.sitesCount} Sites
                    </span>
                  </div>
                </div>

                {/* Content Box */}
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
        ) : (
          <div className="p-16 rounded-[2.5rem] bg-white border border-black/10 text-center shadow-lg my-8">
            <Layers className="w-12 h-12 text-black/20 mx-auto mb-4" />
            <h3 className="text-2xl font-serif text-[#1A1A1A]">No Jurisdictions Located</h3>
            <p className="text-black/50 text-sm mt-2 max-w-md mx-auto">
              No states found matching your criteria in this geographic zone. Try resetting your filter to &ldquo;All&rdquo;.
            </p>
            <Link
              href="/states"
              className="inline-block mt-6 px-6 py-2.5 rounded-full bg-[#1A1A1A] text-white text-xs font-mono uppercase tracking-widest hover:bg-[#D35234] transition-colors"
            >
              Reset Filters
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}