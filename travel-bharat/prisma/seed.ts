import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting subcontinental database population...");

  // 1. Inscribe Taxonomies
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "heritage" },
      update: {},
      create: { name: "Heritage", slug: "heritage", description: "Monolithic citadels, forts, palaces, and archaeological complexes." },
    }),
    prisma.category.upsert({
      where: { slug: "spiritual" },
      update: {},
      create: { name: "Spiritual", slug: "spiritual", description: "Sacred riverfronts, Vedic sanctums, and high-altitude Buddhist gompas." },
    }),
    prisma.category.upsert({
      where: { slug: "nature" },
      update: {},
      create: { name: "Nature", slug: "nature", description: "Endemic biodiversity reserves, biosphere wetlands, and cloud forests." },
    }),
    prisma.category.upsert({
      where: { slug: "adventure" },
      update: {},
      create: { name: "Adventure", slug: "adventure", description: "High Himalayan passes, white-water gorges, and cold desert terrain." },
    }),
  ]);

  const [heritage, spiritual, nature, adventure] = categories;

  // 2. Inscribe States & Union Territories
  const statesData = [
    {
      name: "Rajasthan",
      slug: "rajasthan",
      capital: "Jaipur",
      region: "North India",
      heroImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1600",
      shortDescription: "Living desert citadels, Rajput fortresses, and royal craftsmanship.",
      description: "A sovereign expanse of desert frontiers, royal Rajput architecture, and deep folk traditions spanning the Thar Desert.",
    },
    {
      name: "Uttar Pradesh",
      slug: "uttar-pradesh",
      capital: "Lucknow",
      region: "North India",
      heroImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1600",
      shortDescription: "The sacred Ganga basin, eternal Varanasi ghats, and Mughal architectural marvels.",
      description: "The historical heartland of northern India, anchored by millennia-old Vedic rituals along the Ganga and Indo-Islamic monuments.",
    },
    {
      name: "Karnataka",
      slug: "karnataka",
      capital: "Bengaluru",
      region: "South India",
      heroImage: "https://images.unsplash.com/photo-1600100397608-f010f4439c63?q=80&w=1600",
      shortDescription: "Deccan plateau granite boulder plains and monolithic Vijayanagara ruins.",
      description: "A convergence of ancient dynasties, monolithic boulder terrains, sandalwood crafts, and coffee plantations across the Deccan.",
    },
    {
      name: "Kerala",
      slug: "kerala",
      capital: "Thiruvananthapuram",
      region: "South India",
      heroImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1600",
      shortDescription: "Tropical shola cloud forests, backwater lagoons, and spice highlands.",
      description: "A tropical corridor along the Malabar Coast flanked by the Western Ghats, renowned for sacred groves and backwaters.",
    },
    {
      name: "Maharashtra",
      slug: "maharashtra",
      capital: "Mumbai",
      region: "West India",
      heroImage: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=1600",
      shortDescription: "Basalt rock-cut caves, Maratha mountain citadels, and coastal corridors.",
      description: "Spanning the volcanic Deccan Traps to the Konkan Coast, featuring monumental rock-cut cave temples and hill fort networks.",
    },
    {
      name: "Assam",
      slug: "assam",
      capital: "Dispur",
      region: "Northeast India",
      heroImage: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?q=80&w=1600",
      shortDescription: "Brahmaputra alluvial grasslands and the sanctuary of the Great One-Horned Rhino.",
      description: "The gateway to Northeast India, shaped by the mighty Brahmaputra river and UNESCO biodiversity reserves.",
    },
    {
      name: "Ladakh",
      slug: "ladakh",
      capital: "Leh",
      region: "North India",
      heroImage: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=1600",
      shortDescription: "High-altitude desert passes, azure glacial lakes, and cliffside Buddhist gompas.",
      description: "A Trans-Himalayan desert characterized by jagged snowline ridges, stark landscapes, and ancient Tibetan Buddhist monastic culture.",
    },
    {
      name: "Odisha",
      slug: "odisha",
      capital: "Bhubaneswar",
      region: "East India",
      heroImage: "https://images.unsplash.com/photo-1600100397608-f010f4439c63?q=80&w=1600",
      shortDescription: "Kalinga stone temples, celestial sun chariots, and sacred coastal shrines.",
      description: "An ancient maritime civilization famed for Kalinga architectural deulas, chlorite stone carvings, and holy coastal sanctums.",
    },
  ];

  const statesMap = new Map();
  for (const s of statesData) {
    const record = await prisma.state.upsert({
      where: { slug: s.slug },
      update: {},
      create: s,
    });
    statesMap.set(s.slug, record.id);
  }

  // 3. Inscribe Verified Destinations
  const destinations = [
    {
      name: "Taj Mahal Complex",
      slug: "taj-mahal",
      stateId: statesMap.get("uttar-pradesh"),
      categoryId: heritage.id,
      heroImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1600",
      shortDescription: "Translucent Makrana white marble mausoleum framed by symmetrical charbagh waterways.",
      description: "Commissioned in 1632 by Shah Jahan to honor Mumtaz Mahal. Clad in white Makrana marble with intricate pietre dure floral inlays and four earthquake-deflecting minarets.",
      bestTimeToVisit: "October to March",
      entryFee: "₹50 (Ind) / ₹1,100 (For)",
      openingTime: "06:00 AM",
      closingTime: "06:30 PM (Closed Fridays)",
      address: "Tajganj, Agra, Uttar Pradesh 282001",
      verified: true,
      featured: true,
    },
    {
      name: "Varanasi Sacred Ghats",
      slug: "varanasi-ghats",
      stateId: statesMap.get("uttar-pradesh"),
      categoryId: spiritual.id,
      heroImage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1600",
      shortDescription: "Sacred stone riverfront terraces on the Ganga echoing with ancient Vedic fire rituals.",
      description: "An unbroken chain of 84 stone riverfront terraces on the crescent curve of the sacred Ganga, hosting dawn ablutions and evening Aarti.",
      bestTimeToVisit: "October to March",
      entryFee: "Free Public Access",
      openingTime: "04:00 AM",
      closingTime: "11:00 PM",
      address: "Dashashwamedh Ghat Road, Varanasi, Uttar Pradesh 221001",
      verified: true,
      featured: true,
    },
    {
      name: "Hampi Monuments",
      slug: "hampi-monuments",
      stateId: statesMap.get("karnataka"),
      categoryId: heritage.id,
      heroImage: "https://images.unsplash.com/photo-1600100397608-f010f4439c63?q=80&w=1600",
      shortDescription: "Monolithic golden granite boulder empire of the Vijayanagara dynasty.",
      description: "Over 1,600 surviving ruins spanning royal elephant stables, musical stone pillars, and the iconic monolithic stone chariot of Vittala Temple.",
      bestTimeToVisit: "October to March",
      entryFee: "₹40 (Ind) / ₹600 (For)",
      openingTime: "06:00 AM",
      closingTime: "06:00 PM",
      address: "Hampi, Vijayanagara District, Karnataka 583239",
      verified: true,
      featured: true,
    },
    {
      name: "Mehrangarh Fort",
      slug: "mehrangarh-fort",
      stateId: statesMap.get("rajasthan"),
      categoryId: heritage.id,
      heroImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1600",
      shortDescription: "A 400-foot sandstone cliff fortress guarding Jodhpur's historic Blue City.",
      description: "Built by Rao Jodha in 1459, Mehrangarh rises on sheer basalt cliffs, housing exquisite courtyards, mirror chambers, and royal palanquins.",
      bestTimeToVisit: "October to March",
      entryFee: "₹100 (Ind) / ₹600 (For)",
      openingTime: "09:00 AM",
      closingTime: "05:00 PM",
      address: "Fort Road, Jodhpur, Rajasthan 342006",
      verified: true,
      featured: true,
    },
    {
      name: "Jaisalmer Citadel",
      slug: "jaisalmer-citadel",
      stateId: statesMap.get("rajasthan"),
      categoryId: heritage.id,
      heroImage: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1600",
      shortDescription: "A living yellow sandstone fortress rising from the dunes of the Thar Desert.",
      description: "One of the world's few functioning living forts, founded in 1156 CE by Rawal Jaisal. Houses multi-story havelis and ancient Jain temple libraries.",
      bestTimeToVisit: "November to February",
      entryFee: "₹100 (Ind) / ₹250 (For)",
      openingTime: "09:00 AM",
      closingTime: "06:00 PM",
      address: "Fort Road, Jaisalmer, Rajasthan 345001",
      verified: true,
      featured: true,
    },
    {
      name: "Ellora Kailasa Complex",
      slug: "ellora-caves",
      stateId: statesMap.get("maharashtra"),
      categoryId: heritage.id,
      heroImage: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1600",
      shortDescription: "The world's largest monolithic structure carved top-to-bottom from a single basalt cliff.",
      description: "Cave 16 at Ellora was excavated top-down in the 8th century by Rashtrakuta artisans. Over 200,000 tonnes of volcanic rock were removed by hand.",
      bestTimeToVisit: "October to March",
      entryFee: "₹40 (Ind) / ₹600 (For)",
      openingTime: "06:00 AM",
      closingTime: "06:00 PM (Closed Tuesdays)",
      address: "Ellora, Chhatrapati Sambhaji Nagar, Maharashtra 431102",
      verified: true,
      featured: true,
    },
    {
      name: "Munnar Hills",
      slug: "munnar-plantations",
      stateId: statesMap.get("kerala"),
      categoryId: nature.id,
      heroImage: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1600",
      shortDescription: "High-altitude tea estates piercing cloud lines in the Western Ghats.",
      description: "Sprawling rolling hills of tea bushes and shola rainforests sheltering the endangered Nilgiri Tahr and south India's highest peak, Anamudi.",
      bestTimeToVisit: "September to May",
      entryFee: "₹125 (Park Permit)",
      openingTime: "07:00 AM",
      closingTime: "04:30 PM",
      address: "Idukki District, Kerala 685612",
      verified: true,
      featured: true,
    },
    {
      name: "Kaziranga Grasslands",
      slug: "kaziranga-national-park",
      stateId: statesMap.get("assam"),
      categoryId: nature.id,
      heroImage: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?q=80&w=1600",
      shortDescription: "Alluvial floodplains protecting two-thirds of the world's Great One-Horned Rhinoceroses.",
      description: "A UNESCO-inscribed natural sanctuary along the Brahmaputra River hosting tigers, wild water buffalo, and dense marshland ecosystems.",
      bestTimeToVisit: "November to April",
      entryFee: "₹100 + Safari Fee",
      openingTime: "07:30 AM",
      closingTime: "04:00 PM",
      address: "Golaghat & Nagaon Districts, Assam 785609",
      verified: true,
      featured: true,
    },
    {
      name: "Pangong Tso Basin",
      slug: "pangong-tso",
      stateId: statesMap.get("ladakh"),
      categoryId: adventure.id,
      heroImage: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=1600",
      shortDescription: "A colour-shifting endorheic lake at 14,270 feet ringed by barren mountain ridges.",
      description: "Extending across the Changthang plateau, Pangong is renowned for crystalline saline waters that shift between azure, emerald, and violet.",
      bestTimeToVisit: "June to September",
      entryFee: "₹400 (Ladakh Protected Area Permit)",
      openingTime: "Sunrise",
      closingTime: "Sunset",
      address: "Leh Sub-Division, Ladakh 194101",
      verified: true,
      featured: true,
    },
    {
      name: "Sun Temple Konark",
      slug: "konark-sun-temple",
      stateId: statesMap.get("odisha"),
      categoryId: heritage.id,
      heroImage: "https://images.unsplash.com/photo-1600100397608-f010f4439c63?q=80&w=1600",
      shortDescription: "A monumental 13th-century stone chariot carved with 24 precision sundial wheels.",
      description: "Built by King Narasimhadeva I of the Eastern Ganga dynasty, the temple is designed as a colossal stone chariot of Surya pulled by seven horses.",
      bestTimeToVisit: "November to February",
      entryFee: "₹40 (Ind) / ₹600 (For)",
      openingTime: "06:00 AM",
      closingTime: "08:00 PM",
      address: "Konark, Puri District, Odisha 752111",
      verified: true,
      featured: true,
    },
  ];

  for (const d of destinations) {
    await prisma.touristPlace.upsert({
      where: { slug: d.slug },
      update: {},
      create: d,
    });
  }

  console.log("Database successfully populated with sovereign entities.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });