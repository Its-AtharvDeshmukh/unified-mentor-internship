import prisma from "@/lib/prisma";
import { createTouristPlace } from "@/actions/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default async function NewDestinationPage() {
  const states = await prisma.state.findMany({ orderBy: { name: "asc" } });
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  async function handleSubmit(formData: FormData) {
    "use server";
    const res = await createTouristPlace(formData);
    if (res.success) {
      redirect("/admin/dashboard");
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F4F0] text-[#1C1C1C] p-6 lg:p-12 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Navigation */}
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black/60 hover:text-black">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-xl border border-black/5 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D35234]/10 text-[#D35234] text-xs font-bold uppercase tracking-widest mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> Registry Entry
            </div>
            <h1 className="text-3xl font-serif tracking-tight">Add New Tourist Destination</h1>
            <p className="text-black/60 text-sm mt-1">Populate the editorial and logistical parameters for the digital encyclopedia.</p>
          </div>

          <form action={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-bold text-black/70">Destination Name</label>
                <input required name="name" type="text" placeholder="e.g. Taj Mahal" className="w-full px-4 py-3 rounded-2xl bg-[#F5F4F0] border border-black/10 outline-none text-sm font-medium focus:ring-2 ring-[#D35234]/20" />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-bold text-black/70">State / Territory</label>
                <select required name="stateId" className="w-full px-4 py-3 rounded-2xl bg-[#F5F4F0] border border-black/10 outline-none text-sm font-medium">
                  <option value="">Select State...</option>
                  {states.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-bold text-black/70">Category</label>
                <select required name="categoryId" className="w-full px-4 py-3 rounded-2xl bg-[#F5F4F0] border border-black/10 outline-none text-sm font-medium">
                  <option value="">Select Category...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-bold text-black/70">Best Time to Visit</label>
                <input name="bestTimeToVisit" type="text" placeholder="e.g. October – March" className="w-full px-4 py-3 rounded-2xl bg-[#F5F4F0] border border-black/10 outline-none text-sm font-medium" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider font-bold text-black/70">Hero Image URL</label>
              <input required name="heroImage" type="url" placeholder="https://images.unsplash.com/..." className="w-full px-4 py-3 rounded-2xl bg-[#F5F4F0] border border-black/10 outline-none text-sm font-medium" />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider font-bold text-black/70">Short Tagline Description</label>
              <input required name="shortDescription" type="text" placeholder="One sentence summary..." className="w-full px-4 py-3 rounded-2xl bg-[#F5F4F0] border border-black/10 outline-none text-sm font-medium" />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider font-bold text-black/70">Full Editorial Narrative</label>
              <textarea required name="description" rows={5} placeholder="Detailed historical and cultural overview..." className="w-full px-4 py-3 rounded-2xl bg-[#F5F4F0] border border-black/10 outline-none text-sm font-medium resize-none" />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider font-bold text-black/70">Entry Fee Details</label>
              <input name="entryFee" type="text" placeholder="e.g. ₹50 per person" className="w-full px-4 py-3 rounded-2xl bg-[#F5F4F0] border border-black/10 outline-none text-sm font-medium" />
            </div>

            <button type="submit" className="w-full py-4 rounded-2xl bg-[#D35234] text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#b84227] transition-all shadow-lg cursor-pointer">
              Publish to Digital Atlas
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}