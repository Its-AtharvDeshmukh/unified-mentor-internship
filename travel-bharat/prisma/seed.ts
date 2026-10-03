import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.galleryImage.deleteMany();
  await prisma.touristPlace.deleteMany();
  await prisma.category.deleteMany();
  await prisma.state.deleteMany();

  // 1. Seed Categories
  const heritage = await prisma.category.create({
    data: { name: "Heritage", slug: "heritage", description: "Ancient monuments and historical structures." },
  });
  const spiritual = await prisma.category.create({
    data: { name: "Spiritual", slug: "spiritual", description: "Sacred shrines and ghats." },
  });
  const nature = await prisma.category.create({
    data: { name: "Nature", slug: "nature", description: "Hills, forests, and valleys." },
  });
  const adventure = await prisma.category.create({
    data: { name: "Adventure", slug: "adventure", description: "High-altitude passes and lakes." },
  });

  // 2. Seed States
  const up = await prisma.state.create({
    data: {
      name: "Uttar Pradesh",
      slug: "uttar-pradesh",
      type: "STATE",
      capital: "Lucknow",
      region: "North",
      shortDescription: "Heartland of ancient rivers, spiritual heritage, and Mughal architecture.",
      description: "Uttar Pradesh holds some of India's most revered spiritual and historical sites, from the ghats of Varanasi to the Taj Mahal in Agra.",
      heroImage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1200",
    },
  });

  // 3. Seed Tourist Places
  await prisma.touristPlace.create({
    data: {
      name: "Varanasi Ghats",
      slug: "varanasi-ghats",
      stateId: up.id,
      categoryId: spiritual.id,
      shortDescription: "Sacred stone steps, evening prayers, and centuries of living traditions along the Ganga.",
      description: "An unbroken chain of 84 stone riverfront ghats dating from the 18th century. The spiritual nexus of morning ablutions, Vedic chanting, and evening sacred Ganga Aarti ceremonies.",
      bestTimeToVisit: "October – March",
      entryFee: "Free Public Access",
      openingTime: "00:00",
      closingTime: "23:59",
      address: "Dashashwamedh Ghat, Varanasi, UP",
      heroImage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1200",
      featured: true,
      verified: true,
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });