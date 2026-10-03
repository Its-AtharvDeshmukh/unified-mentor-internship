import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { LuxuryNavbar } from "@/components/ui/LuxuryNavbar";
import { MapPin, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Geopolitical Atlas | TravelBharat",
  description: "Browse 28 states and 8 union territories organized through an editorial geographic lens.",
};

export default async function StatesIndexPage() {
  const states = await prisma.state.findMany({
    include: {
      _count: {
        select: { touristPlaces: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <main className="bg-[#F5F4F0] text-[#1C1C1C] min-h-screen font-sans selection:bg-[#D35234] selection:text-white">
      <LuxuryNavbar />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-36 pb-24">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-[#D35234] mb-4">
            Geographic Directory
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-light tracking-tight text-[#1C1C1C]">
            States & <span className="italic">Territories.</span>
          </h1>
          <p className="text-[#1C1C1C]/60 text-lg mt-4 font-medium leading-relaxed">
            Explore verified administrative capitals, regional zones, and inscribed monuments across India&apos;s federated landscape.
          </p>
        </div>

        {/* State Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {states.map((state) => (
            <Link
              key={state.id}
              href={`/states/${state.slug}`}
              className="group relative flex flex-col justify-between rounded-[2.5rem] overflow-hidden bg-white border border-black/5 shadow-xl hover:-translate-y-1.5 transition-all duration-500"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={state.heroImage}
                  alt={state.name}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-mono font-medium uppercase tracking-widest text-[#E8956F] border border-white/10">
                    {state.region} Zone
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <span className="text-xs uppercase tracking-widest font-mono text-white/80">
                    Capital: {state.capital}
                  </span>
                  <span className="text-xs uppercase tracking-widest font-mono bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md">
                    {state._count.touristPlaces} Sites
                  </span>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-3xl font-serif font-light text-[#1C1C1C] group-hover:text-[#D35234] transition-colors">
                    {state.name}
                  </h3>
                  <p className="text-sm text-[#1C1C1C]/60 font-medium mt-2 line-clamp-2 leading-relaxed">
                    {state.shortDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-black/10 flex items-center justify-between font-mono text-xs uppercase tracking-widest text-[#D35234]">
                  <span>Explore State Dossier</span>
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