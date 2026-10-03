"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Compass,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Volume2,
  VolumeX,
  Play,
  Pause,
} from "lucide-react";

interface SceneItem {
  id: number;
  title: string;
  subheading: string;
  state: string;
  category: string;
  badge: string;
  narrative: string;
  slug: string;
  videoUrl: string;
  fallbackImage: string;
}

const DISCOVERY_REELS: SceneItem[] = [
  {
    id: 1,
    title: "Varanasi",
    subheading: "Sacred Dawn Along the Riverbank",
    state: "Uttar Pradesh",
    category: "Spiritual Heritage",
    badge: "Continuous Ancient Civilization",
    narrative: "A profound rhythm of ceremonial bells, morning chants, and timeless stone stairways.",
    slug: "varanasi-ghats",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-temple-in-india-42999-large.mp4",
    fallbackImage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=2000",
  },
  {
    id: 2,
    title: "Hampi",
    subheading: "Granite Architecture of the Deccan",
    state: "Karnataka",
    category: "Monolithic Wonder",
    badge: "Protected Archaeological Site",
    narrative: "Colossal boulder plains framing royal pavilions, temple halls, and sculpted chariot shrines.",
    slug: "hampi-monuments",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-flying-over-an-ancient-temple-in-a-forest-43003-large.mp4",
    fallbackImage: "https://images.unsplash.com/photo-1600100397608-f010f4439c63?q=80&w=2000",
  },
  {
    id: 3,
    title: "Pangong Tso",
    subheading: "Glacial Basin of the Trans-Himalayas",
    state: "Ladakh",
    category: "High-Altitude Frontier",
    badge: "4,225m Elevation Basin",
    narrative: "An expanse of shifting sapphire waters set against barren, dramatic mountain ridge lines.",
    slug: "pangong-tso",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-mountains-in-a-cold-climate-41484-large.mp4",
    fallbackImage: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=2000",
  },
  {
    id: 4,
    title: "Munnar",
    subheading: "Cloud Terraces in the Western Ghats",
    state: "Kerala",
    category: "Tropical Highlands",
    badge: "Global Biodiversity Hotspot",
    narrative: "Sweeping emerald valleys where coastal clouds settle over historic tea hills.",
    slug: "munnar-plantations",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-green-mountain-landscape-41482-large.mp4",
    fallbackImage: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=2000",
  },
];

export function Hero() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [isPlaybackActive, setIsPlaybackActive] = useState(true);
  const mediaElements = useRef<(HTMLVideoElement | null)[]>([]);

  const activeReel = DISCOVERY_REELS[activeIdx];

  useEffect(() => {
    if (!isPlaybackActive) return;
    const interval = setInterval(() => {
      setActiveIdx((current) => (current + 1) % DISCOVERY_REELS.length);
    }, 11000);
    return () => clearInterval(interval);
  }, [isPlaybackActive]);

  useEffect(() => {
    mediaElements.current.forEach((element, index) => {
      if (!element) return;
      if (index === activeIdx) {
        element.currentTime = 0;
        element.play().catch(() => {});
      } else {
        element.pause();
      }
    });
  }, [activeIdx]);

  const handleAudioToggle = () => {
    const targetMuted = !isAudioMuted;
    setIsAudioMuted(targetMuted);
    mediaElements.current.forEach((el) => {
      if (el) el.muted = targetMuted;
    });
  };

  const handlePlaybackToggle = () => {
    const nextState = !isPlaybackActive;
    setIsPlaybackActive(nextState);
    const currentVideo = mediaElements.current[activeIdx];
    if (currentVideo) {
      if (nextState) currentVideo.play().catch(() => {});
      else currentVideo.pause();
    }
  };

  return (
    <section className="relative min-h-[96vh] w-full flex flex-col justify-end bg-black text-[#F9F8F6] overflow-hidden pt-28 pb-12">
      {/* Background Video Engine */}
      {DISCOVERY_REELS.map((item, idx) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === activeIdx ? "opacity-100 z-0" : "opacity-0 -z-10 pointer-events-none"
          }`}
        >
          <video
            ref={(node) => {
              mediaElements.current[idx] = node;
            }}
            src={item.videoUrl}
            poster={item.fallbackImage}
            playsInline
            loop
            muted={isAudioMuted}
            className="w-full h-full object-cover scale-105 transition-transform duration-[12000ms] ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/75" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
        </div>
      ))}

      {/* Floating Control Badges */}
      <div className="absolute top-28 right-6 lg:right-12 z-20 flex items-center gap-2">
        <button
          onClick={handleAudioToggle}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/60 hover:bg-black/85 border border-white/15 text-xs text-white backdrop-blur-xl transition-all cursor-pointer"
          title="Toggle Ambient Audio"
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4 text-[#F4C430]" /> : <Volume2 className="w-4 h-4 text-[#F4C430]" />}
          <span className="hidden sm:inline text-[11px] uppercase tracking-wider">
            {isAudioMuted ? "Sound Off" : "Ambient Sound"}
          </span>
        </button>

        <button
          onClick={handlePlaybackToggle}
          className="p-2.5 rounded-2xl bg-black/60 hover:bg-black/85 border border-white/15 text-white backdrop-blur-xl transition-all cursor-pointer"
          title={isPlaybackActive ? "Pause Sequence" : "Play Sequence"}
        >
          {isPlaybackActive ? <Pause className="w-4 h-4 text-[#F4C430]" /> : <Play className="w-4 h-4 text-[#F4C430]" />}
        </button>
      </div>

      {/* Editorial Content Display */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-2xl bg-black/60 border border-white/15 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#F4C430] animate-ping" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#F4C430] font-semibold">
                {activeReel.badge}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-[#F4C430] tracking-widest uppercase font-medium">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>{activeReel.state} • {activeReel.category}</span>
              </div>
              <h1 className="text-6xl sm:text-7xl lg:text-9xl font-serif font-light text-white tracking-tight leading-[0.95]">
                {activeReel.title}
              </h1>
            </div>

            <p className="text-base sm:text-xl text-white/90 max-w-2xl font-light italic leading-relaxed border-l-2 border-[#F4C430] pl-6 py-1">
              &ldquo;{activeReel.narrative}&rdquo;
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-3">
              <Link
                href={`/destinations/${activeReel.slug}`}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#F4C430] to-[#E2725B] text-black font-semibold text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:opacity-95 transition-all shadow-lg shadow-[#F4C430]/20 group cursor-pointer"
              >
                <span>Examine Destination Details</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </Link>
              <a
                href="#destinations"
                className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs uppercase tracking-[0.2em] font-medium backdrop-blur-md transition-all flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-[#F4C430]" />
                <span>Geographic Directory</span>
              </a>
            </div>
          </div>

          {/* Interactive Reel Navigator */}
          <div className="lg:col-span-4 flex flex-col justify-end space-y-4">
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <span className="text-xs uppercase tracking-[0.2em] text-[#F4C430] font-semibold">
                0{activeIdx + 1} / 0{DISCOVERY_REELS.length} Active Reel
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setActiveIdx((prev) => (prev === 0 ? DISCOVERY_REELS.length - 1 : prev - 1))
                  }
                  className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                  title="Previous Atlas"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveIdx((prev) => (prev + 1) % DISCOVERY_REELS.length)}
                  className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                  title="Next Atlas"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {DISCOVERY_REELS.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setActiveIdx(index)}
                  className={`w-full p-3.5 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer ${
                    index === activeIdx
                      ? "bg-white/15 border border-[#F4C430]/70 backdrop-blur-xl shadow-lg"
                      : "bg-white/[0.04] border border-white/5 hover:bg-white/10"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">{item.title}</span>
                      {index === activeIdx && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F4C430] text-black font-bold uppercase tracking-wider">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-white/50">{item.state}</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-[#F4C430]">
                    {item.category.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}