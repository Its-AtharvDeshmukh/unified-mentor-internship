import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, MapPin, Calendar, Clock, IndianRupee, Landmark } from "lucide-react";
import { LuxuryNavbar } from "@/components/ui/LuxuryNavbar";

interface DestinationItem {
  name: string;
  slug: string;
  category: string;
  heroImage: string;
  shortDescription: string;
  bestTimeToVisit: string;
  entryFee: string;
  openingTime: string;
}

const STATE_ARCHIVES: Record<string, {
  name: string;
  capital: string;
  region: string;
  heroImage: string;
  description: string;
  destinations: DestinationItem[];
}> = {
  "maharashtra": {
    name: "Maharashtra",
    capital: "Mumbai",
    region: "West India",
    heroImage: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=1600",
    description: "The gateway of western India, defined by the Western Ghats, rock-cut basalt sanctuaries, Maratha forts, and bustling urban hubs.",
    destinations: [
      {
        name: "Ellora Kailasa Complex",
        slug: "ellora-caves",
        category: "Heritage",
        heroImage: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1200",
        shortDescription: "The world's largest monolithic rock excavation, carved top-to-bottom from a single basalt cliff.",
        bestTimeToVisit: "Oct – Mar",
        entryFee: "₹40 Ind / ₹600 For",
        openingTime: "06:00 AM – 06:00 PM",
      },
    ],
  },
  "uttar-pradesh": {
    name: "Uttar Pradesh",
    capital: "Lucknow",
    region: "North India",
    heroImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1600",
    description: "The cradle of Indo-Islamic architecture and ancient river civilizations along the sacred Ganga and Yamuna basins.",
    destinations: [
      {
        name: "Taj Mahal Complex",
        slug: "taj-mahal",
        category: "Heritage",
        heroImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1200",
        shortDescription: "Translucent Makrana white marble mausoleum framed by symmetrical charbagh waterways.",
        bestTimeToVisit: "Oct – Mar",
        entryFee: "₹50 Ind / ₹1,100 For",
        openingTime: "06:00 AM – 06:30 PM",
      },
      {
        name: "Varanasi Sacred Ghats",
        slug: "varanasi-ghats",
        category: "Spiritual",
        heroImage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1200",
        shortDescription: "Sacred stone riverfront terraces on the Ganga echoing with Vedic fire chants.",
        bestTimeToVisit: "Oct – Mar",
        entryFee: "Free Public Access",
        openingTime: "Open 24 Hours",
      },
    ],
  },
  "karnataka": {
    name: "Karnataka",
    capital: "Bengaluru",
    region: "South India",
    heroImage: "https://images.unsplash.com/photo-1600100397608-f010f4439c63?q=80&w=1600",
    description: "Deccan plateau boulder expanses, monolithic Vijayanagara temples, and sandalwood artisan clusters.",
    destinations: [
      {
        name: "Hampi Monuments",
        slug: "hampi-monuments",
        category: "Heritage",
        heroImage: "https://images.unsplash.com/photo-1600100397608-f010f4439c63?q=80&w=1200",
        shortDescription: "Granite monolithic empire along the Tungabhadra with musical pillared temples.",
        bestTimeToVisit: "Oct – Mar",
        entryFee: "₹40 Ind / ₹600 For",
        openingTime: "06:00 AM – 06:00 PM",
      },
    ],
  },
  "assam": {
    name: "Assam",
    capital: "Dispur",
    region: "Northeast India",
    heroImage: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?q=80&w=1600",
    description: "Gateway to the Northeast with tea terraces, silk weaving, and UNESCO wildlife reserves along the Brahmaputra.",
    destinations: [
      {
        name: "Kaziranga Grasslands",
        slug: "kaziranga-national-park",
        category: "Nature",
        heroImage: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?q=80&w=1200",
        shortDescription: "Protected alluvial floodplains harboring two-thirds of the world's Great One-Horned Rhinoceroses.",
        bestTimeToVisit: "Nov – Apr",
        entryFee: "₹100 + Safari",
        openingTime: "07:30 AM – 04:00 PM",
      },
    ],
  },
  "rajasthan": {
    name: "Rajasthan",
    capital: "Jaipur",
    region: "North India",
    heroImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1600",
    description: "The land of kings, known for Rajput citadels, desert outposts, stepwells, and living folklore.",
    destinations: [
      {
        name: "Mehrangarh Fort",
        slug: "mehrangarh-fort",
        category: "Heritage",
        heroImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200",
        shortDescription: "Towering 400-foot sandstone fortress guarding Jodhpur's historic Blue City.",
        bestTimeToVisit: "Oct – Mar",
        entryFee: "₹100 Ind / ₹600 For",
        openingTime: "09:00 AM – 05:00 PM",
      },
      {
        name: "Jaisalmer Citadel",
        slug: "jaisalmer-citadel",
        category: "Heritage",
        heroImage: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200",
        shortDescription: "A living golden sandstone citadel rising from the dunes of the Thar Desert.",
        bestTimeToVisit: "Nov – Feb",
        entryFee: "₹100 Ind / ₹250 For",
        openingTime: "09:00 AM – 06:00 PM",
      },
    ],
  },
};

export default async function StateDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let dbState: any = null;
  try {
    dbState = await prisma.state.findUnique({
      where: { slug },
      include: {
        touristPlaces: {
          include: { category: true },
        },
      },
    });
  } catch {}

  const fallback = STATE_ARCHIVES[slug] || STATE_ARCHIVES["rajasthan"];

  // Merge live database destinations with fallbacks so newly created items appear immediately
  const destinations: DestinationItem[] = dbState?.touristPlaces?.length
    ? dbState.touristPlaces.map((p: any) => ({
        name: p.name,
        slug: p.slug,
        category: p.category.name,
        heroImage: p.heroImage,
        shortDescription: p.shortDescription,
        bestTimeToVisit: p.bestTimeToVisit || "Oct – Mar",
        entryFee: p.entryFee || "Standard Tariff",
        openingTime: p.openingTime ? `${p.openingTime} – ${p.closingTime}` : "Standard Hours",
      }))
    : fallback.destinations;

  const stateData = {
    name: dbState?.name || fallback.name,
    capital: dbState?.capital || fallback.capital,
    region: dbState?.region || fallback.region,
    heroImage: dbState?.heroImage || fallback.heroImage,
    description: dbState?.description || fallback.description,
    destinations,
  };

  return (
    <main className="bg-[#FAF8F5] min-h-screen text-[#1A1A1A] font-sans antialiased selection:bg-[#D35234] selection:text-white">
      <LuxuryNavbar />

      {/* Floating Return Pill */}
      <div className="fixed top-28 left-6 md:left-12 z-40">
        <Link
          href="/states"
          className="group inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/80 hover:bg-[#1A1A1A] hover:text-white backdrop-blur-xl rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all font-mono text-[10px] uppercase tracking-[0.2em] font-bold border border-black/5"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Return to States Directory</span>
        </Link>
      </div>

      {/* State Hero Banner */}
      <section className="relative flex min-h-[75vh] flex-col px-3 pb-8 pt-6 sm:px-6 lg:px-12">
        <div className="relative flex flex-1 items-end overflow-hidden rounded-[2.5rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.18)] sm:rounded-[3rem] sm:p-12 lg:p-16">
          <Image
            src={stateData.heroImage}
            alt={stateData.name}
            fill
            unoptimized
            priority
            className="object-cover scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20" />

          <div className="relative z-10 max-w-4xl space-y-4">
            <div className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#E8956F]">
              <span>{stateData.region}</span>
              <span>•</span>
              <span>Administrative Capital: {stateData.capital}</span>
            </div>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif font-light text-white tracking-tight leading-none">
              {stateData.name}
            </h1>
            <p className="text-white/80 text-base sm:text-lg font-medium max-w-2xl leading-relaxed border-l-2 border-[#D35234] pl-5">
              {stateData.description}
            </p>
          </div>
        </div>
      </section>

      {/* Destinations for THIS STATE ONLY */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 border-b border-black/10 pb-6 gap-4">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#D35234] block mb-1">
              State-Specific Dossier
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light">
              Inscribed Monuments in <span className="italic">{stateData.name}</span>
            </h2>
          </div>
          <span className="font-mono text-xs uppercase tracking-widest px-4 py-2 rounded-full bg-white border border-black/10 font-bold text-[#D35234]">
            {stateData.destinations.length} Registered Sites
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stateData.destinations.map((place) => (
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
              </div>

              <div className="p-7 flex-1 flex flex-col justify-between space-y-4">
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

                <div className="pt-2 flex items-center justify-between font-mono text-xs uppercase tracking-widest text-[#D35234] font-bold">
                  <span>Examine Dossier</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}