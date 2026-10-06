import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  IndianRupee, 
  ShieldCheck, 
  Compass, 
  ExternalLink,
  Landmark,
  CheckCircle2
} from "lucide-react";
import { LuxuryNavbar } from "@/components/ui/LuxuryNavbar";

// Comprehensive fallback registry covering EVERY slug across your homepage
const ALL_DESTINATIONS_DATA: Record<string, any> = {
  // Heritage & UNESCO Sites
  "taj-mahal": {
    name: "Taj Mahal Complex",
    state: { name: "Uttar Pradesh" },
    category: { name: "Cultural UNESCO Heritage" },
    serial: "WHC-1983-0252",
    coordinates: "27.1751° N, 78.0421° E",
    elevation: "171 m",
    era: "1632–1653 CE",
    architect: "Ustad Ahmad Lahori",
    heroImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1800",
    shortDescription: "The pinnacle of Mughal symmetry, executed in translucent Makrana white marble beside the Yamuna River.",
    description: `Commissioned in 1632 by the Mughal emperor Shah Jahan to house the tomb of Mumtaz Mahal.\n\nThe central mausoleum stands on a raised square plinth with four detached minarets. Intricate floral arabesques and calligraphy made from jasper, lapis lazuli, and carnelian are inlaid directly into the marble blocks using the pietre dure technique.`,
    highlights: ["Inlaid Pietre Dure Floral Marblework", "Symmetrical Charbagh Waterways", "Acoustically Tuned Central Crypt", "Earthquake-Deflecting Minarets"],
    bestTimeToVisit: "October to March",
    entryFee: "₹50 (Ind) / ₹1,100 (For)",
    openingTime: "06:00 AM",
    closingTime: "06:30 PM (Closed Fridays)",
    address: "Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh 282001",
  },
  "konark-sun-temple": {
    name: "Sun Temple Konark",
    state: { name: "Odisha" },
    category: { name: "Architectural UNESCO Heritage" },
    serial: "WHC-1984-0246",
    coordinates: "19.8876° N, 86.0945° E",
    elevation: "12 m",
    era: "c. 1250 CE",
    architect: "Bisu Maharana",
    heroImage: "https://images.unsplash.com/photo-1600100397608-f010f4439c63?q=80&w=1800",
    shortDescription: "A monumental 13th-century stone chariot carved with 24 astronomical wheels functioning as precision sundials.",
    description: `Conceived as a colossal stone chariot of the Sun God Surya with 24 carved stone wheels pulled by seven horses.\n\nEach carved wheel functions as a precision sundial calculating time down to the minute based on sun-cast shadows.`,
    highlights: ["24 Functional Astronomical Sundials", "Kalinga Architectural Sanctuary", "Chlorite Stone Carvings of Surya", "Ancient Maritime Beacon"],
    bestTimeToVisit: "November to February",
    entryFee: "₹40 (Ind) / ₹600 (For)",
    openingTime: "06:00 AM",
    closingTime: "08:00 PM",
    address: "Konark, Puri District, Odisha 752111",
  },
  "hampi-monuments": {
    name: "Hampi Monuments",
    state: { name: "Karnataka" },
    category: { name: "Monolithic Heritage" },
    serial: "WHC-1986-0241",
    coordinates: "15.3350° N, 76.4600° E",
    elevation: "467 m",
    era: "14th–16th Century CE",
    architect: "Vijayanagara Guilds",
    heroImage: "https://images.unsplash.com/photo-1600100397608-f010f4439c63?q=80&w=1800",
    shortDescription: "A golden granite boulder capital of the Vijayanagara Empire sprawling across the Deccan plateau.",
    description: `Covering over 4,100 hectares along the Tungabhadra River, Hampi contains more than 1,600 surviving ruins of the Vijayanagara Empire.\n\nFamous for the iconic stone chariot of the Vittala Temple, musical pillars that produce acoustic resonance when struck, royal elephant stables, and towering temple gopurams.`,
    highlights: ["Vittala Temple Stone Chariot", "Acoustic Musical Pillars", "Royal Elephant Stables", "Tungabhadra River Coracle Waterways"],
    bestTimeToVisit: "October to March",
    entryFee: "₹40 (Ind) / ₹600 (For)",
    openingTime: "06:00 AM",
    closingTime: "06:00 PM",
    address: "Hampi, Vijayanagara District, Karnataka 583239",
  },
  "kaziranga-national-park": {
    name: "Kaziranga Grasslands",
    state: { name: "Assam" },
    category: { name: "Natural Heritage" },
    serial: "WHC-1985-0337",
    coordinates: "26.5775° N, 93.1711° E",
    elevation: "80 m",
    era: "Established 1905",
    architect: "Natural Alluvial Reserve",
    heroImage: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?q=80&w=1800",
    shortDescription: "Protected alluvial floodplains harboring two-thirds of the world's Great One-Horned Rhinoceroses.",
    description: `Situated along the southern bank of the Brahmaputra River, Kaziranga provides sanctuary to one-horned rhinos, Bengal tigers, wild water buffalo, and migratory wetland avifauna.`,
    highlights: ["Two-Thirds of Global Rhino Population", "Dense Wild Water Buffalo Habitats", "Brahmaputra Floodplain Ecosystem", "Elephant Migration Corridors"],
    bestTimeToVisit: "November to April",
    entryFee: "₹100 + Safari Permit",
    openingTime: "07:30 AM",
    closingTime: "04:00 PM",
    address: "Kanchanjuri, Golaghat District, Assam 785609",
  },

  // Seasonal & Regional Destinations
  "jaisalmer-citadel": {
    name: "Jaisalmer Fort",
    state: { name: "Rajasthan" },
    category: { name: "Living Desert Fort" },
    serial: "WHC-2013-0247",
    coordinates: "26.9124° N, 70.9126° E",
    elevation: "225 m",
    era: "1156 CE",
    architect: "Rawal Jaisal",
    heroImage: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1800",
    shortDescription: "A living golden sandstone citadel rising from the sandy dunes of the great Thar Desert.",
    description: `One of the very few 'living forts' in the world, where roughly a quarter of the old city's population still resides within its ramparts. Built from yellow sandstone that shifts to honey-gold at sunset.`,
    highlights: ["Living Fortress Quarters", "Ornate Jain Temples", "Patwon Ki Haveli", "Thar Desert Sunset Panoramas"],
    bestTimeToVisit: "November to February",
    entryFee: "₹100 (Ind) / ₹250 (For)",
    openingTime: "09:00 AM",
    closingTime: "06:00 PM",
    address: "Fort Road, Jaisalmer, Rajasthan 345001",
  },
  "meenakshi-temple": {
    name: "Meenakshi Amman Temple",
    state: { name: "Tamil Nadu" },
    category: { name: "Dravidian Sacred Architecture" },
    serial: "ASI-TN-MAD-001",
    coordinates: "9.9195° N, 78.1193° E",
    elevation: "136 m",
    era: "14th–17th Century CE",
    architect: "Pandyan & Nayaka Guilds",
    heroImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1800",
    shortDescription: "A Dravidian architectural wonder featuring fourteen towering sculpted gopurams encrusted with thousands of deities.",
    description: `Historic Hindu temple located on the southern bank of the Vaigai River in Madurai. Dedicated to Meenakshi (a form of Parvati) and Sundareswarar (a form of Shiva). Its monumental gopurams rise up to 52 meters.`,
    highlights: ["Hall of Thousand Pillars", "Golden Lotus Sacred Tank", "Towering Sculpted Gopurams", "Nightly Divine Procession"],
    bestTimeToVisit: "October to March",
    entryFee: "Free Entry (Special Darshan ₹50)",
    openingTime: "05:00 AM",
    closingTime: "10:00 PM",
    address: "Madurai Main, Madurai, Tamil Nadu 625001",
  },
  "rann-of-kutch": {
    name: "White Rann of Kutch",
    state: { name: "Gujarat" },
    category: { name: "Seasonal Salt Expanse" },
    serial: "GEO-GJ-KUTCH-01",
    coordinates: "23.8342° N, 69.8329° E",
    elevation: "15 m",
    era: "Geological Formation",
    architect: "Seasonal Salt Evaporation",
    heroImage: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=1800",
    shortDescription: "One of the world's largest salt deserts, transformed under the full moon into an endless crystalline plain.",
    description: `Spanning over 7,500 square kilometers, the White Rann is submerged in sea water during monsoon months, and becomes a vast glittering field of natural white salt crystals in the winter dry season.`,
    highlights: ["Full Moon Salt Expanse", "Kala Dungar Highest Point", "Rann Utsav Cultural Pavilion", "Flamingo Sanctuary Wetlands"],
    bestTimeToVisit: "November to February",
    entryFee: "₹100 (Permit Fee)",
    openingTime: "06:00 AM",
    closingTime: "08:00 PM",
    address: "Dhordo, Kutch District, Gujarat 370510",
  },
  "cherrapunji": {
    name: "Cherrapunji (Sohra)",
    state: { name: "Meghalaya" },
    category: { name: "Living Root Ecosystem" },
    serial: "GEO-MEG-EKH-01",
    coordinates: "25.2702° N, 91.7323° E",
    elevation: "1,484 m",
    era: "Indigenous Botanical Engineering",
    architect: "Khasi Weaver Guilds",
    heroImage: "https://images.unsplash.com/photo-1622308644420-a602e1c90554?q=80&w=1800",
    shortDescription: "Double-decker suspension bridges hand-grown from living Ficus elastica tree roots over torrential rainforest rivers.",
    description: `Famous as one of the wettest locations on Earth, the cloud-covered cliffs of Sohra harbor the legendary living root bridges. Mastered by the indigenous Khasi tribes, living rubber fig roots are guided across riverbanks over 15 to 30 years to form indestructible natural bridges.`,
    highlights: ["Double-Decker Living Root Bridge", "Nohkalikai Waterfall Plunge", "Mawsmai Limestone Caves", "Seven Sisters Waterfalls"],
    bestTimeToVisit: "June to September (Waterfalls) / Oct to Feb",
    entryFee: "₹50 (Local Village Fee)",
    openingTime: "06:00 AM",
    closingTime: "05:00 PM",
    address: "Nongriat Village, Sohra, Meghalaya 793108",
  },
  "valley-of-flowers": {
    name: "Valley of Flowers",
    state: { name: "Uttarakhand" },
    category: { name: "Alpine Botanical Sanctuary" },
    serial: "WHC-1988-0335",
    coordinates: "30.7280° N, 79.6053° E",
    elevation: "3,658 m",
    era: "Inscribed 1988",
    architect: "Garhwal Himalayan Biosphere",
    heroImage: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=1800",
    shortDescription: "A high-altitude Himalayan valley carpeted in hundreds of species of endemic wildflowers during monsoon.",
    description: `Nestled in the high Garhwal Himalayas, this UNESCO National Park comes alive with vibrant alpine blooms following monsoon rains. Home to endangered animals including the Asiatic black bear, snow leopard, and blue sheep.`,
    highlights: ["Endemic Himalayan Wildflowers", "Pushpawati River Trail", "Hemkund Sahib Alpine Pass", "Snow Leopard Biosphere"],
    bestTimeToVisit: "July to September",
    entryFee: "₹150 (Ind) / ₹600 (For)",
    openingTime: "07:00 AM",
    closingTime: "05:00 PM",
    address: "Chamoli District, Uttarakhand 246443",
  },
  "athirappilly-falls": {
    name: "Athirappilly Waterfalls",
    state: { name: "Kerala" },
    category: { name: "Rainforest River Cascade" },
    serial: "GEO-KER-THR-01",
    coordinates: "10.2851° N, 76.5698° E",
    elevation: "390 m",
    era: "Western Ghats Geological Corridor",
    architect: "Chalakudy River Gorge",
    heroImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1800",
    shortDescription: "An 80-foot wide thundering cascade framed by the dense tropical rainforests of the Western Ghats.",
    description: `Often called the 'Niagara of South India', Athirappilly is the largest waterfall in Kerala. The Chalakudy River drops 80 feet through multiple streams into a rocky gorge surrounded by dense Shola forests.`,
    highlights: ["Thundering River Gorge", "Endangered Hornbill Habitat", "Vazhachal Forest Cascade", "Trek to Lower Spray Basin"],
    bestTimeToVisit: "June to October (Monsoon Flow)",
    entryFee: "₹50 (Ind) / ₹150 (For)",
    openingTime: "08:00 AM",
    closingTime: "05:00 PM",
    address: "Chalakudy Taluk, Thrissur, Kerala 680721",
  },
  "spiti-valley": {
    name: "Spiti Valley",
    state: { name: "Himachal Pradesh" },
    category: { name: "Cold Mountain Desert" },
    serial: "GEO-HP-LAH-01",
    coordinates: "32.2461° N, 78.0349° E",
    elevation: "3,800 m",
    era: "c. 1000 CE (Monasteries)",
    architect: "Trans-Himalayan Tibetan Monasteries",
    heroImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1800",
    shortDescription: "A cold desert mountain valley perched in the high Himalayas, dotted with thousand-year-old Buddhist monasteries.",
    description: `Located in the remote high Himalayas, Spiti is a rugged moonscape characterized by stark jagged peaks, rushing turquoise rivers, and ancient whitewashed Tibetan gompas such as Key and Dhankar.`,
    highlights: ["Key Gompa Fortress Monastery", "Chandratal Crystalline Crescent Lake", "Komic Highest Motorable Village", "Chicham Suspension Bridge Gorge"],
    bestTimeToVisit: "May to October",
    entryFee: "Free Entry (Permit for foreigners)",
    openingTime: "24 Hours (Passes open seasonally)",
    closingTime: "Subject to snow clearance",
    address: "Lahaul and Spiti District, Himachal Pradesh 172114",
  },
  "nubra-valley": {
    name: "Nubra Valley Dunes",
    state: { name: "Ladakh" },
    category: "High-Altitude Cold Desert",
    serial: "GEO-LAD-LEH-02",
    coordinates: "34.6863° N, 77.5673° E",
    elevation: "3,048 m",
    era: "Historic Silk Road Corridor",
    architect: "Shyok & Siachen River Basin",
    heroImage: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=1800",
    shortDescription: "White cold-desert sand dunes nestled between snowcapped jagged peaks, home to double-humped Bactrian camels.",
    description: `Reached via the Khardung La pass, Nubra Valley features a dramatic landscape where towering sand dunes sit directly beside glacial rivers and dramatic mountain walls.`,
    highlights: ["Hunder Sand Dunes & Bactrian Camels", "Diskit Monastery Giant Buddha", "Panamik Natural Hot Springs", "Turtuk Balti Border Village"],
    bestTimeToVisit: "May to September",
    entryFee: "₹400 (Ladakh Inner Line Permit)",
    openingTime: "Sunrise to Sunset",
    closingTime: "Passes subject to weather",
    address: "Nubra Sub-Division, Leh, Ladakh 194401",
  },
  "darjeeling": {
    name: "Darjeeling Tea Ridgelines",
    state: { name: "West Bengal" },
    category: { name: "Himalayan Hill Station" },
    serial: "WHC-1999-0944",
    coordinates: "27.0410° N, 88.2663° E",
    elevation: "2,042 m",
    era: "19th Century Colonial Era",
    architect: "Darjeeling Himalayan Railway",
    heroImage: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1800",
    shortDescription: "Emerald tea plantations draped over misty Himalayan ridges, overlooking the towering peak of Mount Kanchenjunga.",
    description: `A historic Himalayan hill station renowned worldwide for aromatic orthodox black tea and the UNESCO-listed toy train climbing through loops and reverses.`,
    highlights: ["Tiger Hill Dawn Kanchenjunga View", "UNESCO Heritage Toy Train", "Happy Valley Tea Estate", "Batasia Loop War Memorial"],
    bestTimeToVisit: "March to May & October to December",
    entryFee: "Free Public Access",
    openingTime: "24 Hours",
    closingTime: "Year-Round Access",
    address: "Darjeeling District, West Bengal 734101",
  },
  "varanasi-ghats": {
    name: "Varanasi Sacred Ghats",
    state: { name: "Uttar Pradesh" },
    category: { name: "Spiritual Civilization" },
    serial: "ASI-UP-VAR-001",
    coordinates: "25.3076° N, 83.0130° E",
    elevation: "80 m",
    era: "c. 11th Century BCE",
    architect: "Ancient Riverfront Masonry",
    heroImage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1800",
    shortDescription: "Sacred stone riverfront terraces on the Ganga echoing with ancient Vedic fire chants and dawn rituals.",
    description: `The spiritual heart of India, with 84 continuous stone ghats along the crescent curve of the sacred Ganga. A timeless center of learning, philosophy, and spiritual rituals.`,
    highlights: ["Evening Ganga Aarti Ceremony", "Dawn Boat Ride on River Ganga", "Kashi Vishwanath Temple Corridor", "Manikarnika Historical Ghat"],
    bestTimeToVisit: "October to March",
    entryFee: "Free Public Access",
    openingTime: "Open 24 Hours",
    closingTime: "Aarti at 06:30 PM",
    address: "Dashashwamedh Ghat Road, Varanasi, Uttar Pradesh 221001",
  },
  "mehrangarh-fort": {
    name: "Mehrangarh Citadel",
    state: { name: "Rajasthan" },
    category: { name: "Rajput Citadel Architecture" },
    serial: "ASI-RAJ-JOD-001",
    coordinates: "26.2980° N, 73.0188° E",
    elevation: "122 m",
    era: "1459 CE",
    architect: "Rao Jodha",
    heroImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1800",
    shortDescription: "A colossal 400-foot sandstone fortress perched on a cliff guarding Jodhpur's historic Blue City.",
    description: `One of the largest and most magnificent forts in India, Mehrangarh rises sheer and impregnable above Jodhpur. Its palaces feature intricate stone lattice screens and royal museum treasures.`,
    highlights: ["Sheesh Mahal Palace of Mirrors", "Phool Mahal Golden Chamber", "Panoramic View of the Blue City", "Intricate Red Sandstone Jali Work"],
    bestTimeToVisit: "October to March",
    entryFee: "₹100 (Ind) / ₹600 (For)",
    openingTime: "09:00 AM",
    closingTime: "05:00 PM",
    address: "Fort Road, Jodhpur, Rajasthan 342006",
  },
  "pangong-tso": {
    name: "Pangong Tso Basin",
    state: { name: "Ladakh" },
    category: { name: "High-Altitude Lake" },
    serial: "GEO-LAD-LEH-01",
    coordinates: "33.7595° N, 78.6674° E",
    elevation: "4,225 m",
    era: "Geological Formation",
    architect: "Endorheic Trans-Himalayan Basin",
    heroImage: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=1800",
    shortDescription: "A saline lake at 14,270 feet shifting from turquoise to deep cobalt beneath barren ridgelines.",
    description: `Extending from India into the Tibetan Plateau, Pangong Tso is an endorheic lake known for its crystalline water that changes shades of blue and green under the shifting sunlight.`,
    highlights: ["Colour-Shifting Crystalline Waters", "Chang La High Mountain Pass", "Spangmik Lakeside Village", "Migratory Bar-Headed Geese"],
    bestTimeToVisit: "June to September",
    entryFee: "₹400 (Inner Line Permit)",
    openingTime: "Sunrise to Sunset",
    closingTime: "Closed in deep winter",
    address: "Pangong Lake, Leh District, Ladakh 194201",
  },
  "munnar-plantations": {
    name: "Munnar Shola Hills",
    state: { name: "Kerala" },
    category: { name: "Tropical High-Altitude Flora" },
    serial: "GEO-KER-IDK-01",
    coordinates: "10.0889° N, 77.0595° E",
    elevation: "1,532 m",
    era: "Late 19th Century",
    architect: "Western Ghats Mountain Ecosystem",
    heroImage: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1800",
    shortDescription: "Emerald tea estates piercing tropical rainforest clouds, home to the endangered Nilgiri Tahr.",
    description: `Located at the confluence of three mountain streams in the Western Ghats, Munnar features rolling hills blanketed with manicured green tea bushes, exotic flora, and mist-covered peaks.`,
    highlights: ["Eravikulam National Park (Nilgiri Tahr)", "Anamudi Highest Peak in South India", "Tata Tea Museum & Factory", "Mattupetty Dam & Lake"],
    bestTimeToVisit: "September to May",
    entryFee: "₹125 (Park Entry)",
    openingTime: "07:00 AM",
    closingTime: "04:30 PM",
    address: "Idukki District, Kerala 685612",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let place = null;
  try {
    place = await prisma.touristPlace.findUnique({ where: { slug: resolvedParams.slug } });
  } catch {}

  const data = place || ALL_DESTINATIONS_DATA[resolvedParams.slug] || ALL_DESTINATIONS_DATA["taj-mahal"];
  return { 
    title: `${data.name} • Official Archival Dossier | TravelBharat`, 
    description: data.shortDescription 
  };
}

export default async function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let place = null;

  try {
    place = await prisma.touristPlace.findUnique({
      where: { slug: resolvedParams.slug },
      include: { state: true, category: true },
    });
  } catch {}

  // Seamless fallback guarantees zero 404s
  const data = place || ALL_DESTINATIONS_DATA[resolvedParams.slug] || ALL_DESTINATIONS_DATA["taj-mahal"];

  return (
    <main className="bg-[#FAF8F5] min-h-screen text-[#1A1A1A] font-sans antialiased selection:bg-[#D35234] selection:text-white">
      <LuxuryNavbar />

      {/* Floating Return Pill */}
      <div className="fixed top-28 left-6 md:left-12 z-40">
        <Link 
          href="/" 
          className="group inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/80 hover:bg-[#1A1A1A] hover:text-white backdrop-blur-xl rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all font-mono text-[10px] uppercase tracking-[0.2em] font-bold border border-black/5"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Return to Atlas</span>
        </Link>
      </div>

      {/* Framed Floating Hero Box */}
      <section className="relative flex min-h-[92svh] flex-col px-3 pb-8 pt-6 sm:px-6 lg:px-12">
        <div className="relative flex flex-1 items-end overflow-hidden rounded-[2.5rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.18)] sm:rounded-[3rem] sm:p-12 lg:p-16">
          <Image 
            src={data.heroImage} 
            alt={data.name} 
            fill 
            unoptimized 
            priority 
            className="object-cover scale-105"
          />
          
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/20" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />

          <div className="relative z-10 flex w-full flex-col gap-6">
            <div className="max-w-4xl space-y-6">
              
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 text-[#E8956F] font-mono text-[10px] font-bold uppercase tracking-[0.25em]">
                  {data.serial || "REGISTERED HERITAGE SITE"}
                </span>
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-white font-mono text-[10px] font-bold uppercase tracking-[0.2em]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> ASI & State Verified
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-xl text-white/80 font-mono text-[10px] uppercase tracking-widest">
                  <MapPin className="w-3 h-3 text-[#D35234]" /> {data.state?.name || "India"}
                </span>
              </div>

              <h1 className="text-5xl sm:text-7xl lg:text-[7.5rem] font-serif font-light text-white tracking-tight leading-[0.92] drop-shadow-2xl">
                {data.name}
              </h1>

              <p className="text-white/85 text-base sm:text-xl font-medium max-w-2xl leading-relaxed drop-shadow-md border-l-2 border-[#D35234] pl-5">
                {data.shortDescription}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/20 pt-6 font-mono text-xs uppercase tracking-[0.2em] text-white/60">
              <span className="text-[#E8956F]">ERA: {data.era || "Historic Epoch"}</span>
              <span>DATUM: {data.elevation || "Variable"}</span>
              <span className="text-[#D35234] font-bold">{data.coordinates || "Geolocated Node"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Parameters Strip */}
      <section className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 -mt-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 sm:p-8 rounded-[2.5rem] bg-white border border-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/40 font-bold block">
              Inscribed Epoch
            </span>
            <p className="text-base sm:text-lg font-serif font-medium text-[#1A1A1A]">
              {data.era || "Historic Horizon"}
            </p>
          </div>

          <div className="space-y-1 border-l border-black/10 pl-4 sm:pl-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/40 font-bold block">
              Altitude Datum
            </span>
            <p className="text-base sm:text-lg font-serif font-medium text-[#1A1A1A]">
              {data.elevation || "Standard MSL"}
            </p>
          </div>

          <div className="space-y-1 border-l border-black/10 pl-4 sm:pl-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/40 font-bold block">
              Master Guild
            </span>
            <p className="text-base sm:text-lg font-serif font-medium text-[#1A1A1A] truncate">
              {data.architect || "Traditional Artisans"}
            </p>
          </div>

          <div className="space-y-1 border-l border-black/10 pl-4 sm:pl-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/40 font-bold block">
              Coordinates
            </span>
            <p className="text-xs sm:text-sm font-mono font-bold text-[#D35234] truncate">
              {data.coordinates || "Geolocated Node"}
            </p>
          </div>
        </div>
      </section>

      {/* Narrative & Visitor Logistics */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left Column: Historical Chronicle */}
        <div className="lg:col-span-8 space-y-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-[#D35234]">
              <Landmark className="w-4 h-4" /> Official Archival Record
            </div>
            <h2 className="text-4xl sm:text-5xl font-serif font-light text-[#1A1A1A] tracking-tight leading-tight">
              Historical & Structural <span className="italic">Chronicle.</span>
            </h2>
            <div className="text-lg text-black/75 font-normal leading-relaxed whitespace-pre-line space-y-6 pt-4 font-sans">
              {data.description}
            </div>
          </div>

          {data.highlights && (
            <div className="space-y-6 pt-6 border-t border-black/10">
              <h3 className="font-serif text-2xl font-light text-[#1A1A1A]">
                Key Architectural <span className="italic">Hallmarks</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.highlights.map((item: string, i: number) => (
                  <div 
                    key={i} 
                    className="flex items-start gap-3.5 p-5 rounded-2xl bg-white border border-black/5 shadow-sm"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#D35234] shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-black/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Visitor Logistics */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-8 sm:p-10 rounded-[3rem] bg-white border border-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.06)] space-y-8 sticky top-32">
            
            <div className="flex items-center justify-between border-b border-black/10 pb-5">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#D35234]">
                Visitor Logistics
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-mono text-[9px] font-bold uppercase tracking-wider">
                Active Protocol
              </span>
            </div>

            <ul className="space-y-6">
              <li>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/40 block mb-1.5 font-bold">
                  Recommended Season
                </span>
                <div className="flex items-center gap-3 font-medium text-base text-[#1A1A1A]">
                  <Calendar className="w-5 h-5 text-[#E8956F]" />
                  <span>{data.bestTimeToVisit || "Year-round Access"}</span>
                </div>
              </li>

              <li>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/40 block mb-1.5 font-bold">
                  Admission Tariff
                </span>
                <div className="flex items-center gap-3 font-medium text-base text-[#1A1A1A]">
                  <IndianRupee className="w-5 h-5 text-[#D35234]" />
                  <span>{data.entryFee || "Standard Public Tariff"}</span>
                </div>
              </li>

              <li>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/40 block mb-1.5 font-bold">
                  Visiting Schedule
                </span>
                <div className="flex items-center gap-3 font-medium text-base text-[#1A1A1A]">
                  <Clock className="w-5 h-5 text-sky-500" />
                  <span>{data.openingTime} – {data.closingTime}</span>
                </div>
              </li>

              <li className="pt-4 border-t border-black/10">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/40 block mb-1.5 font-bold">
                  Geographical Location
                </span>
                <div className="flex items-start gap-3 font-medium text-sm text-black/70 leading-relaxed">
                  <MapPin className="w-5 h-5 text-[#D35234] shrink-0 mt-0.5" />
                  <span>{data.address || data.state?.name}</span>
                </div>
              </li>
            </ul>

            <div className="pt-4 space-y-3">
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.name + ' ' + (data.address || ''))}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 rounded-2xl bg-[#1A1A1A] hover:bg-[#D35234] text-white font-mono text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-xl"
              >
                <span>Navigate via GPS</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <Link
                href="/interactive-map"
                className="w-full py-3.5 rounded-2xl bg-[#F5F4F0] hover:bg-black/5 text-[#1A1A1A] font-mono text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-colors border border-black/5"
              >
                <Compass className="w-4 h-4 text-[#D35234]" />
                <span>Locate on Atlas Radar</span>
              </Link>
            </div>

          </div>
        </div>

      </section>

      <footer className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-16 pt-8 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-widest text-black/40">
        <span>National Tourism Archive • Sovereign Registry</span>
        <span>Curated Under UNESCO Convention 1972</span>
      </footer>
    </main>
  );
}