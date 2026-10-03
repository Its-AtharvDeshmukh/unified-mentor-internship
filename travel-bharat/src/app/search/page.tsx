import prisma from "@/lib/prisma";
import { DestinationCard } from "@/components/ui/DestinationCard";
import { LuxuryNavbar } from "@/components/ui/LuxuryNavbar";
import { Search as SearchIcon } from "lucide-react";

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";

  const results = query
    ? await prisma.touristPlace.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { state: { name: { contains: query, mode: "insensitive" } } },
            { category: { name: { contains: query, mode: "insensitive" } } },
          ],
        },
        include: { state: true, category: true },
      })
    : [];

  return (
    <main className="bg-[#F5F4F0] text-[#1C1C1C] min-h-screen">
      <LuxuryNavbar />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-36 pb-24">
        <div className="max-w-2xl mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D35234] font-bold block mb-3">
            Search Index Query
          </span>
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight">
            Results for &ldquo;{query}&rdquo;
          </h1>
          <p className="text-black/60 text-sm mt-2 font-medium">
            Found {results.length} verified monuments and sanctuaries matching your parameters.
          </p>
        </div>

        {results.length === 0 ? (
          <div className="p-16 rounded-[2.5rem] bg-white border border-black/5 text-center shadow-xl">
            <SearchIcon className="w-12 h-12 text-black/20 mx-auto mb-4" />
            <h3 className="text-xl font-serif">No matches located</h3>
            <p className="text-black/50 text-sm mt-1">Try searching for broader terms like &quot;Rajasthan&quot;, &quot;Heritage&quot;, or &quot;Temple&quot;.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((place) => (
              <DestinationCard
                key={place.id}
                title={place.name}
                slug={place.slug}
                location={`${place.state.name}`}
                imageUrl={place.heroImage}
                category={place.category.name}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}