import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { 
  ShieldCheck, 
  Plus, 
  Globe, 
  Layers, 
  MapPin, 
  ArrowUpRight, 
  Trash2,
  ExternalLink
} from "lucide-react";
import { deleteDestination } from "@/actions/admin";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("travelbharat_session");

  if (!session || session.value !== "authenticated") {
    redirect("/admin/login");
  }

  const [totalDestinations, totalStates, totalCategories, recentPlaces] = await Promise.all([
    prisma.touristPlace.count(),
    prisma.state.count(),
    prisma.category.count(),
    prisma.touristPlace.findMany({
      include: { state: true, category: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A] p-6 lg:p-12 font-sans selection:bg-[#D35234] selection:text-white">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Navigation & Controls */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-black/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D35234]/10 text-[#D35234] text-[10px] font-bold uppercase tracking-[0.25em] mb-3 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" /> Authenticated Curator Workspace
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-light tracking-tight text-[#1A1A1A]">
              Repository <span className="italic">Console.</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="px-5 py-3 rounded-full bg-white border border-black/10 text-xs font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-all shadow-sm"
            >
              Public View
            </Link>
            <Link
              href="/admin/destinations/new"
              className="px-6 py-3 rounded-full bg-[#D35234] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#1A1A1A] transition-all flex items-center gap-2 shadow-xl shadow-[#D35234]/20"
            >
              <Plus className="w-4 h-4" /> Index Destination
            </Link>
          </div>
        </header>

        {/* Metric Dossiers Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-[2.5rem] bg-white shadow-xl border border-black/5 relative overflow-hidden">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-black/40 font-bold mb-3">
              Indexed Destinations
            </p>
            <div className="flex items-baseline justify-between">
              <span className="text-5xl font-serif font-light">{totalDestinations}</span>
              <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] text-[#D35234] flex items-center justify-center">
                <Globe className="w-6 h-6" />
              </div>
            </div>
            <p className="mt-4 text-xs text-black/50 font-medium">Verified sites active in PostgreSQL.</p>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-white shadow-xl border border-black/5 relative overflow-hidden">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-black/40 font-bold mb-3">
              Federated States & UTs
            </p>
            <div className="flex items-baseline justify-between">
              <span className="text-5xl font-serif font-light">{totalStates}</span>
              <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] text-blue-600 flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
            </div>
            <p className="mt-4 text-xs text-black/50 font-medium">Regional administrative archives.</p>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-white shadow-xl border border-black/5 relative overflow-hidden">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-black/40 font-bold mb-3">
              Heritage Taxonomies
            </p>
            <div className="flex items-baseline justify-between">
              <span className="text-5xl font-serif font-light">{totalCategories}</span>
              <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] text-emerald-600 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
            </div>
            <p className="mt-4 text-xs text-black/50 font-medium">Active classifications on record.</p>
          </div>
        </section>

        {/* Live Registry Table with Real Deletion */}
        <section className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-black/5 space-y-6">
          <div className="flex items-center justify-between border-b border-black/10 pb-6">
            <div>
              <h3 className="text-2xl font-serif font-light text-[#1A1A1A]">Inscribed Monuments Directory</h3>
              <p className="text-xs text-black/50 mt-1">Live synchronized data directly from your Neon PostgreSQL cluster.</p>
            </div>
            <span className="font-mono text-[10px] text-[#D35234] uppercase tracking-widest font-bold">
              {recentPlaces.length} entries shown
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/10 text-[10px] uppercase tracking-[0.2em] text-black/40 font-mono">
                  <th className="pb-4">Destination</th>
                  <th className="pb-4">Region</th>
                  <th className="pb-4">Category</th>
                  <th className="pb-4">Database State</th>
                  <th className="pb-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-sm">
                {recentPlaces.length > 0 ? (
                  recentPlaces.map((place) => (
                    <tr key={place.id} className="group hover:bg-[#FAF8F5]/80 transition-colors">
                      <td className="py-5 font-serif text-lg text-[#1A1A1A]">{place.name}</td>
                      <td className="py-5 text-[#1A1A1A]/70 font-medium">{place.state.name}</td>
                      <td className="py-5">
                        <span className="px-3 py-1 rounded-full border border-black/10 bg-[#FAF8F5] text-[9px] uppercase tracking-widest font-mono font-bold text-black/70">
                          {place.category.name}
                        </span>
                      </td>
                      <td className="py-5">
                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live in Cluster
                        </span>
                      </td>
                      <td className="py-5 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/destinations/${place.slug}`}
                            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[#D35234] hover:text-[#1A1A1A] transition-colors font-mono"
                          >
                            Dossier <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>

                          <form action={async () => {
                            "use server";
                            await deleteDestination(place.id);
                          }}>
                            <button
                              type="submit"
                              className="p-1.5 rounded-lg text-black/30 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete record from cluster"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-black/40 font-mono text-xs">
                      No records indexed yet. Click &ldquo;Index Destination&rdquo; above to populate your database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </main>
  );
}