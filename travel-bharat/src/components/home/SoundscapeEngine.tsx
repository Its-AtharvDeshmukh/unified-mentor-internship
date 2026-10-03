"use client";

import { useState, useRef } from "react";
import { Volume2, VolumeX, Sparkles, Wind, Bell, Waves, Mountain, Play } from "lucide-react";

interface SoundTrack {
  id: string;
  title: string;
  locale: string;
  state: string;
  tag: string;
  icon: typeof Bell;
  frequencies: number[];
  color: string;
}

const SOUNDSCAPES: SoundTrack[] = [
  {
    id: "varanasi",
    title: "Ganga Twilight Resonances",
    locale: "Dashashwamedh Ghat",
    state: "Uttar Pradesh",
    tag: "Aarti Bells & Deep Harmonics",
    icon: Bell,
    frequencies: [216, 432, 648],
    color: "group-hover:text-amber-400",
  },
  {
    id: "spiti",
    title: "Trans-Himalayan Gale",
    locale: "Key Gompa Pass",
    state: "Himachal Pradesh",
    tag: "High Alpine Wind Currents",
    icon: Mountain,
    frequencies: [108, 162, 324],
    color: "group-hover:text-sky-400",
  },
  {
    id: "munnar",
    title: "Rainforest Precipitation",
    locale: "Eravikulam Canopy",
    state: "Kerala",
    tag: "Tropical Shola Cloud Dripping",
    icon: Waves,
    frequencies: [300, 450, 600],
    color: "group-hover:text-emerald-400",
  },
  {
    id: "thar",
    title: "Desert Dune Whispers",
    locale: "Sam Sand Dunes",
    state: "Rajasthan",
    tag: "Silica Sand Drifts",
    icon: Wind,
    frequencies: [150, 225, 300],
    color: "group-hover:text-[#F4C430]",
  },
];

const ActiveVisualizer = () => (
  <div className="flex items-end gap-1 h-5">
    <div className="w-1.5 bg-[#F4C430] animate-[bounce_0.7s_infinite] h-full rounded-t-sm" />
    <div className="w-1.5 bg-[#F4C430] animate-[bounce_1.1s_infinite] h-3/5 rounded-t-sm" />
    <div className="w-1.5 bg-[#F4C430] animate-[bounce_0.8s_infinite] h-4/5 rounded-t-sm" />
    <div className="w-1.5 bg-[#F4C430] animate-[bounce_1.3s_infinite] h-2/5 rounded-t-sm" />
  </div>
);

export function SoundscapeEngine() {
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  const stopAudio = () => {
    oscillatorsRef.current.forEach((osc) => {
      try { osc.stop(); osc.disconnect(); } catch {}
    });
    oscillatorsRef.current = [];
    setActiveTrack(null);
  };

  const playSynthesizedAmbience = (track: SoundTrack) => {
    if (activeTrack === track.id) {
      stopAudio();
      return;
    }
    stopAudio();
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = audioCtxRef.current || new AudioContextClass();
    audioCtxRef.current = ctx;
    if (ctx.state === "suspended") ctx.resume();

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime + 1.5);
    masterGain.connect(ctx.destination);

    const oscs: OscillatorNode[] = [];
    track.frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = idx === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.connect(masterGain);
      osc.start();
      oscs.push(osc);
    });

    oscillatorsRef.current = oscs;
    setActiveTrack(track.id);
  };

  return (
    <section className="py-28 px-6 lg:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-[0.25em] text-[#F4C430] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sensory Travel Exploration</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-serif font-light text-white tracking-tight">
            Subcontinental <br />
            <span className="text-white/50 italic">Acoustic Atlas</span>
          </h2>
          <p className="text-white/60 text-base md:text-lg mt-4 font-light leading-relaxed">
            Close your eyes. We have mapped the harmonic frequencies and ambient spatial tones of India’s most sacred and natural landmarks. Experience the true atmosphere before you travel.
          </p>
        </div>
        {activeTrack && (
          <button onClick={stopAudio} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs uppercase tracking-widest font-semibold hover:bg-red-500/20 transition-all cursor-pointer">
            <VolumeX className="w-4 h-4" /> Silence Engine
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SOUNDSCAPES.map((track, idx) => {
          const Icon = track.icon;
          const isPlaying = activeTrack === track.id;

          return (
            <button
              key={track.id}
              onClick={() => playSynthesizedAmbience(track)}
              className={`group text-left relative overflow-hidden rounded-[32px] transition-all duration-700 cursor-pointer ${
                isPlaying 
                  ? "bg-[#141414] border border-[#F4C430]/50 shadow-[0_0_50px_rgba(244,196,48,0.15)] scale-[1.02] p-8 md:p-10" 
                  : "bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] p-8 md:p-10"
              }`}
            >
              {/* Massive background number watermark */}
              <div className="absolute -right-6 -bottom-10 text-[180px] font-serif font-bold text-white/[0.02] pointer-events-none group-hover:text-white/[0.04] transition-colors leading-none">
                0{idx + 1}
              </div>

              <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                <div className="flex items-start justify-between">
                  <div className={`p-4 rounded-2xl bg-black/50 border border-white/10 transition-colors duration-500 ${track.color}`}>
                    {isPlaying ? <ActiveVisualizer /> : <Icon className="w-7 h-7" />}
                  </div>
                  <span className={`text-[10px] uppercase tracking-[0.2em] font-semibold px-4 py-1.5 rounded-full border backdrop-blur-md transition-all ${
                    isPlaying ? "bg-[#F4C430] text-black border-[#F4C430]" : "bg-white/5 text-white/50 border-white/10"
                  }`}>
                    {isPlaying ? "Live Broadcasting" : "Press to Listen"}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs uppercase tracking-widest text-[#E2725B] font-medium">
                      {track.state}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="text-xs uppercase tracking-widest text-white/40">
                      {track.locale}
                    </span>
                  </div>
                  <h3 className="text-3xl font-serif text-white group-hover:text-[#F4C430] transition-colors">
                    {track.title}
                  </h3>
                  <p className="text-sm text-white/50 mt-2 font-light tracking-wide">
                    {track.tag}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}