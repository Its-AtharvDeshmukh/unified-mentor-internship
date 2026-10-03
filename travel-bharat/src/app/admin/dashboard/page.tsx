import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { ShieldCheck, Plus, Globe, Layers, MapPin, ArrowUpRight, LogOut } from "lucide-react";

export default async function AdminDashboardPage() {
  // Check auth cookie
  const cookieStore = cookies();
  const session = cookieStore.get("travelbharat_session");

  if (!session || session.value !== "authenticated") {
    redirect("/admin/login");
  }

  const totalDestinations = await prisma.touristPlace.count();
  const totalStates = await prisma.state.count();
  const totalCategories = await prisma.category.count();
  
  const recentPlaces = await prisma.touristPlace.findMany({
    include: { state: true, category: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <main className="min-h-screen bg-[#F5F4F0] text-[#1C1C1C] p-6 lg:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D35234]/10 text-[#D35234] text-xs font-bold uppercase tracking-widest mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Authenticated Admin Hub
            </div>
            <h1 className="text-4xl font-serif tracking-tight">Content Management Console</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="px-5 py-2.5 rounded-full bg-white border border-black/10 text-xs font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors">
              View Live Site
            </Link>
            <Link href="/admin/destinations/new" className="px-5 py-2.5 rounded-full bg-[#D35234] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#b84227] transition-colors flex items-center gap-2 shadow-lg">
              <Plus className="w-4 h-4" /> Add Destination
            </Link>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-[2rem] bg-white shadow-xl border border-black/5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-black/40 font-bold mb-1">Total Destinations</p>
              <p className="text-4xl font-serif">{totalDestinations}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F5F4F0] text-[#D35234]">
              <Globe className="w-6 h-6" />
            </div>
          </div>

          <div className="p-8 rounded-[2rem] bg-white shadow-xl border border-black/5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-black/40 font-bold mb-1">Indexed States & UTs</p>
              <p className="text-4xl font-serif">{totalStates}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F5F4F0] text-blue-500">
              <MapPin className="w-6 h-6" />
            </div>
          </div>

          <div className="p-8 rounded-[2rem] bg-white shadow-xl border border-black/5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-black/40 font-bold mb-1">Taxonomy Categories</p>
              <p className="text-4xl font-serif">{totalCategories}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F5F4F0] text-emerald-500">
              <Layers className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Recent Submissions Table */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-black/5 space-y-6">
          <h3 className="text-xl font-serif">Recently Indexed Destinations</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/10 text-[10px] uppercase tracking-widest text-black/40 font-bold">
                  <th className="pb-4">Name</th>
                  <th className="pb-4">State</th>
                  <th className="pb-4">Category</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-sm">
                {recentPlaces.map((place) => (
                  <tr key={place.id} className="group hover:bg-[#F5F4F0]/50 transition-colors">
                    <td className="py-4 font-medium text-[#1C1C1C]">{place.name}</td>
                    <td className="py-4 text-[#1C1C1C]/70">{place.state.name}</td>
                    <td className="py-4"><span className="px-3 py-1 rounded-full bg-black/5 text-[10px] uppercase tracking-wider font-bold">{place.category.name}</span></td>
                    <td className="py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Verified ASI
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <Link href={`/destinations/${place.slug}`} className="inline-flex items-center gap-1 text-xs font-bold text-[#D35234] hover:underline">
                        Preview <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}