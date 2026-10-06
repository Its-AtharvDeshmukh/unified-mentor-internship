import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { createDestination } from "@/actions/admin";

export default function NewDestinationPage() {
  return (
    <main className="min-h-screen bg-[#F5F4F0] text-[#1C1C1C] p-6 lg:p-12 font-sans selection:bg-[#D35234] selection:text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-black/10 text-xs font-mono uppercase tracking-widest text-[#1C1C1C] hover:bg-black hover:text-white transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Console
          </Link>
          <span className="font-mono text-[11px] text-[#D35234] uppercase tracking-widest font-bold">
            Record Registry Compiler
          </span>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-4xl md:text-5xl font-serif font-light text-[#1C1C1C]">
            Index New <span className="italic">Monument.</span>
          </h1>
          <p className="text-[#1C1C1C]/60 text-sm mt-2">
            Append architectural, spiritual, or wilderness records directly to your Neon database cluster.
          </p>
        </div>

        {/* Form Box */}
        <form action={createDestination} className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-black/5 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase tracking-widest text-black/50 font-bold block">
                Destination Name
              </label>
              <input
                name="name"
                required
                placeholder="e.g. Meenakshi Amman Temple"
                className="w-full px-4 py-3.5 rounded-2xl bg-[#F5F4F0] border border-black/10 text-sm outline-none focus:border-[#D35234] transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase tracking-widest text-black/50 font-bold block">
                URL Identifier (Slug)
              </label>
              <input
                name="slug"
                required
                placeholder="e.g. meenakshi-temple"
                className="w-full px-4 py-3.5 rounded-2xl bg-[#F5F4F0] border border-black/10 text-xs font-mono outline-none focus:border-[#D35234] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase tracking-widest text-black/50 font-bold block">
                State / Territory
              </label>
              <input
                name="stateName"
                required
                placeholder="e.g. Tamil Nadu"
                className="w-full px-4 py-3.5 rounded-2xl bg-[#F5F4F0] border border-black/10 text-sm outline-none focus:border-[#D35234] transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase tracking-widest text-black/50 font-bold block">
                Classification Category
              </label>
              <select
                name="categoryName"
                className="w-full px-4 py-3.5 rounded-2xl bg-[#F5F4F0] border border-black/10 text-sm outline-none focus:border-[#D35234] transition-colors font-medium"
              >
                <option value="Heritage">Heritage</option>
                <option value="Spiritual">Spiritual</option>
                <option value="Nature">Nature</option>
                <option value="Adventure">Adventure</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-black/50 font-bold block">
              Hero Cover Image (Unsplash / CDN URL)
            </label>
            <input
              name="heroImage"
              required
              type="url"
              placeholder="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1600"
              className="w-full px-4 py-3.5 rounded-2xl bg-[#F5F4F0] border border-black/10 text-xs font-mono outline-none focus:border-[#D35234] transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-black/50 font-bold block">
              Editorial Hook (Short Description)
            </label>
            <input
              name="shortDescription"
              required
              placeholder="Dravidian architectural masterpiece with towering sculpted gopurams."
              className="w-full px-4 py-3.5 rounded-2xl bg-[#F5F4F0] border border-black/10 text-sm outline-none focus:border-[#D35234] transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-black/50 font-bold block">
              Comprehensive Cultural Narrative
            </label>
            <textarea
              name="description"
              required
              rows={5}
              placeholder="Detailed historical context, architectural notes, and logistical background..."
              className="w-full px-4 py-3.5 rounded-2xl bg-[#F5F4F0] border border-black/10 text-sm outline-none focus:border-[#D35234] transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Visitor Dossier Parameters */}
          <div className="pt-6 border-t border-black/10">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[#D35234] mb-4">
              Visitor Dossier Specifications
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-[10px] font-mono text-black/40 uppercase tracking-widest block mb-1">
                  Optimal Season
                </label>
                <input
                  name="bestTimeToVisit"
                  defaultValue="Oct – Mar"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F4F0] border border-black/10 text-xs font-medium outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-black/40 uppercase tracking-widest block mb-1">
                  Access Fee
                </label>
                <input
                  name="entryFee"
                  defaultValue="₹50 Domestic"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F4F0] border border-black/10 text-xs font-medium outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-black/40 uppercase tracking-widest block mb-1">
                  Opening Time
                </label>
                <input
                  name="openingTime"
                  defaultValue="05:00 AM"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F4F0] border border-black/10 text-xs font-medium outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-black/40 uppercase tracking-widest block mb-1">
                  Closing Time
                </label>
                <input
                  name="closingTime"
                  defaultValue="10:00 PM"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F4F0] border border-black/10 text-xs font-medium outline-none"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-[10px] font-mono text-black/40 uppercase tracking-widest block mb-1">
                Geographical Address
              </label>
              <input
                name="address"
                defaultValue="Madurai Main, Madurai, Tamil Nadu 625001"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F4F0] border border-black/10 text-xs font-medium outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-[#D35234] hover:bg-[#b84227] text-white text-xs font-bold uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-[#D35234]/25 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Commit Destination to Registry
          </button>
        </form>

      </div>
    </main>
  );
}