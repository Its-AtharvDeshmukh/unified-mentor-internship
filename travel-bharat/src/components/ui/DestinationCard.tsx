import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowUpRight, Calendar, IndianRupee, Clock, CheckCircle2 } from "lucide-react";

interface DestinationCardProps {
  title: string;
  slug: string;
  city: string;
  state: string;
  imageUrl: string;
  category: string;
  season: string;
  entryFee: string;
  timings: string;
  tagline: string;
}

export function DestinationCard({
  title,
  slug,
  city,
  state,
  imageUrl,
  category,
  season,
  entryFee,
  timings,
  tagline,
}: DestinationCardProps) {
  return (
    <Link href={`/destinations/${slug}`} className="group block h-full">
      <div className="relative h-full flex flex-col justify-between overflow-hidden rounded-2xl bg-[#141414] border border-white/10 transition-all duration-300 hover:border-[#F4C430]/60 hover:shadow-[0_16px_36px_rgba(0,0,0,0.6)]">
        {/* Visual Imagery */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/40" />

          {/* Top Badges */}
          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-wider uppercase px-3 py-1 rounded-xl bg-black/70 text-[#F4C430] border border-white/10 backdrop-blur-md">
              {category}
            </span>
            <div className="w-8 h-8 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white group-hover:bg-[#F4C430] group-hover:text-black transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          <div className="absolute bottom-3 left-3.5 flex items-center gap-1.5 text-xs text-[#F4C430] font-medium">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>{city}, {state}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Official Tourism Verified</span>
            </div>

            <h3 className="font-serif text-2xl font-normal text-white group-hover:text-[#F4C430] transition-colors leading-snug">
              {title}
            </h3>

            <p className="text-xs text-white/60 mt-2 line-clamp-2 leading-relaxed font-light">
              {tagline}
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div className="mt-5 pt-3.5 border-t border-white/10 grid grid-cols-3 gap-2 text-[10px] uppercase tracking-wider text-white/60">
            <div>
              <span className="block text-white/40 mb-0.5">Best Time</span>
              <span className="text-white font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#E2725B]" /> {season}
              </span>
            </div>
            <div>
              <span className="block text-white/40 mb-0.5">Entry</span>
              <span className="text-white font-medium flex items-center gap-1">
                <IndianRupee className="w-3 h-3 text-[#F4C430]" /> {entryFee}
              </span>
            </div>
            <div>
              <span className="block text-white/40 mb-0.5">Hours</span>
              <span className="text-white font-medium flex items-center gap-1">
                <Clock className="w-3 h-3 text-sky-400" /> {timings}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}