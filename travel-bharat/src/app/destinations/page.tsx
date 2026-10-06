import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { LuxuryNavbar } from "@/components/ui/LuxuryNavbar";
import { MapPin, ArrowUpRight, Sparkles } from "lucide-react";

export const metadata = {
  title: "Destinations Directory • All Inscribed Sites | TravelBharat",
  description: "Comprehensive catalogue of verified cultural, architectural, and natural wonders across India.",
};

const DEFAULT_PLACES = [
  {
    name: "Taj Mahal Complex",
    slug: "taj-mahal",
    state: "Uttar Pradesh",
    category: "Heritage",
    heroImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1200",
    shortDescription: "Translucent Makrana white marble mausoleum framed by symmetrical charbagh waterways.",
    bestTimeToVisit: "Oct – Mar",
    entryFee: "₹50 Ind / ₹1,100 For",
    openingTime: "06:00 AM – 06:30 PM",
  },
  {
    name: "Jaisalmer Fort",
    slug: "jaisalmer-citadel",
    state: "Rajasthan",
    category: "Heritage",
    heroImage: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200",
    shortDescription: "A living golden sandstone citadel rising from the sandy dunes of the Thar Desert.",
    bestTimeToVisit: "Nov – Feb",
    entryFee: "₹100 Ind / ₹250 For",
    openingTime: "09:00 AM – 06:00 PM",
  },
  {
    name: "Meenakshi Temple",
    slug: "meenakshi-temple",
    state: "Tamil Nadu",
    category: "Spiritual",
    heroImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200",
    shortDescription: "Fourteen sculpted gopurams encrusted with thousands of painted deities.",
    bestTimeToVisit: "Oct – Mar",
    entryFee: "Free Entry",
    openingTime: "05:00 AM – 10:00 PM",
  },
  {
    name: "Cherrapunji",
    slug: "cherrapunji",
    state: "Meghalaya",
    category: "Nature",
    heroImage: "https://images.unsplash.com/photo-1622308644420-a602e1c90554?q=80&w=1200",
    shortDescription: "Double-decker suspension bridges hand-grown from living Ficus tree roots.",
    bestTimeToVisit: "Jun – Sep",
    entryFee: "₹50 Local Fee",
    openingTime: "06:00 AM – 05:00 PM",
  },
  {
    name: "Valley of Flowers",
    slug: "valley-of-flowers",
    state: "Uttarakhand",
    category: "Nature",
    heroImage: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=1200",
    shortDescription: "High-altitude Himalayan valley carpeted in endemic alpine wildflowers.",
    bestTimeToVisit: "Jul – Sep",
    entryFee: "₹150 Ind / ₹600 For",
    openingTime: "07:00 AM – 05:00 PM",
  },
  {
    name: "Spiti Valley",
    slug: "spiti-valley",
    state: "Himachal Pradesh",
    category: "Adventure",
    heroImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1200",
    shortDescription: "Cold mountain desert valley dotted with thousand-year-old Buddhist gompas.",
    bestTimeToVisit: "May – Oct",
    entryFee: "Free Entry",
    openingTime: "24 Hours (Seasonal)",
  },
];

export default async function DestinationsIndexPage() {
  let dbPlaces: any[] = [];
  try {
    dbPlaces = await prisma.touristPlace.findMany({
      include: { state: true, category: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {}

  const places = dbPlaces.length > 0
    ? dbPlaces.map((p) => ({
        name: p.name,
        slug: p.slug,
        state: p.state.name,
        category: p.category.name,
        heroImage: p.heroImage,
        shortDescription: p.shortDescription,
        bestTimeToVisit: p.bestTimeToVisit || "Oct – Mar",
        entryFee: p.entryFee || "Standard Tariff",
        openingTime: p.openingTime ? `${p.openingTime} – ${p.closingTime}` : "Standard Hours",
      }))
    : DEFAULT_PLACES;

  return (
    <main className="bg-[#FAF8F5] min-h-screen text-[#1A1A1A] font-sans antialiased selection:bg-[#D35234] selection:text-white">
      <LuxuryNavbar />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-36 pb-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 pb-10 border-b border-black/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D35234]/10 text-[#D35234] text-[10px] font-mono font-bold uppercase tracking-[0.25em] mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Curated National Archive
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-light text-[#1A1A1A] tracking-tight leading-[0.98]">
              All <span className="italic text-[#1A1A1A]/60">Destinations.</span>
            </h1>
            <p className="text-black/60 text-base md:text-lg mt-6 font-medium max-w-xl leading-relaxed">
              Browse sovereign monuments, ancient riverfronts, and ecological reserves catalogued with verified timings, tariffs, and field coordinates.
            </p>
          </div>

          <span className="font-mono text-xs uppercase tracking-widest px-4 py-2 rounded-full bg-white border border-black/10 shadow-sm font-bold text-[#D35234]">
            {places.length} Inscribed Sanctuaries
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {places.map((place) => (
            <Link
              key={place.slug}
              href={`/destinations/${place.slug}`}
              className="group flex flex-col justify-between rounded-[2.5rem] overflow-hidden bg-white border border-black/5 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#1A1A1A]">
                <Image
                  src={place.heroImage}
                  alt={place.name}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#E8956F] font-mono text-[9px] uppercase tracking-widest font-bold border border-white/10">
                    {place.category}
                  </span>
                  <span className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-[#D35234] transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-xs text-white/90 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-[#D35234]" />
                  <span>{place.state}</span>
                </div>
              </div>

              <div className="p-7 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-light text-[#1A1A1A] group-hover:text-[#D35234] transition-colors">
                    {place.name}
                  </h3>
                  <p className="text-xs text-black/60 mt-2 line-clamp-2 leading-relaxed">
                    {place.shortDescription}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-black/5 font-mono text-[10px]">
                  <div>
                    <span className="text-black/40 uppercase tracking-widest block text-[9px]">Season</span>
                    <span className="font-semibold text-black/80 truncate block mt-0.5">{place.bestTimeToVisit}</span>
                  </div>
                  <div>
                    <span className="text-black/40 uppercase tracking-widest block text-[9px]">Entry</span>
                    <span className="font-semibold text-black/80 truncate block mt-0.5">{place.entryFee.split("(")[0]}</span>
                  </div>
                  <div>
                    <span className="text-black/40 uppercase tracking-widest block text-[9px]">Hours</span>
                    <span className="font-semibold text-black/80 truncate block mt-0.5">{place.openingTime.split("–")[0]}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}