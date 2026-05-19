"use client";

import { useState } from "react";
import { Ghost } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AboutAvatarProps {
  avatarUrl: string;
  name: string;
}

const GENGAR_QUOTES = [
  "Gah-hah-hah!",
  "Jibade-protection-band!",
  "Used Hypnosis! 🌀",
  "Used Dream Eater! 😈",
  "Hiding in your shadow...",
  "Used Night Shade! 🌌",
  "Hehe, gotcha! 👻",
];

export default function AboutAvatar({ avatarUrl, name }: AboutAvatarProps) {
  const [isSummoned, setIsSummoned] = useState(false);
  const [quote, setQuote] = useState("");
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; size: number; delay: number }[]
  >([]);

  const playSpookySound = () => {
    try {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      // Play a low spooky digital growl
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.45);

      // Low pass filter to make it sound muffled and ghostly
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(600, ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.45);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.45);

      // High metallic laugh ring
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(700, ctx.currentTime + 0.05);
      osc2.frequency.linearRampToValueAtTime(350, ctx.currentTime + 0.35);

      gain2.gain.setValueAtTime(0, ctx.currentTime);
      gain2.gain.setValueAtTime(0.12, ctx.currentTime + 0.05);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(ctx.currentTime + 0.05);
      osc2.stop(ctx.currentTime + 0.35);
    } catch (e) {
      console.error("Audio playback error", e);
    }
  };

  const triggerEasterEgg = () => {
    if (isSummoned) return;
    setIsSummoned(true);

    const randomQuote =
      GENGAR_QUOTES[Math.floor(Math.random() * GENGAR_QUOTES.length)];
    setQuote(randomQuote);

    playSpookySound();

    // Spawn 12 particle wisps with random positions
    const newParticles = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 120 - 60, // offset relative to center
      y: Math.random() * 30 + 10,
      size: Math.random() * 6 + 4,
      delay: Math.random() * 0.4,
    }));
    setParticles(newParticles);

    // Auto-dismiss Gengar and clear particles
    setTimeout(() => {
      setIsSummoned(false);
      setParticles([]);
    }, 4500);
  };

  return (
    <div className="flex flex-col items-center shrink-0 relative select-none">
      <style>{`
        @keyframes spookyFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-6px) scale(1.03); }
        }
        @keyframes wispFade {
          0% { transform: translateY(0) scale(0.6); opacity: 0; }
          20% { opacity: 0.7; }
          100% { transform: translateY(-70px) scale(1.4); opacity: 0; }
        }
        .animate-spooky-float {
          animation: spookyFloat 3s ease-in-out infinite;
        }
        .animate-wisp {
          animation: wispFade 1.2s ease-out forwards;
        }
      `}</style>

      {/* Avatar Container with Tooltip */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative group cursor-pointer active:scale-95 transition-transform duration-300">
            <img
              src={avatarUrl}
              alt={name}
              className="size-32 rounded-full object-cover border-2 border-border transition-all duration-500 group-hover:scale-105 group-hover:border-purple-500/40 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]"
            />
            {/* Overlay purple glow on hover */}
            <div className="absolute inset-0 rounded-full bg-purple-500/0 group-hover:bg-purple-500/5 transition-colors duration-500 pointer-events-none" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          Favorite Pokémon: Gengar
        </TooltipContent>
      </Tooltip>

      {/* Tiny Easter Egg Trigger Button */}
      <button
        onClick={triggerEasterEgg}
        className="mt-3 group/btn relative flex items-center justify-center p-1.5 rounded-full text-muted-foreground/30 hover:text-purple-400 hover:bg-purple-500/10 hover:shadow-[0_0_10px_rgba(168,85,247,0.2)] transition-all duration-300 cursor-pointer"
        title="Click for a surprise!"
      >
        <Ghost className="size-4 animate-pulse group-hover/btn:scale-110 transition-transform duration-300" />
        <span className="sr-only">Easter Egg</span>
      </button>

      {/* Spooky Wisps / Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-purple-500/40 blur-[1px] pointer-events-none animate-wisp"
          style={{
            left: `calc(50% + ${p.x}px)`,
            bottom: `${p.y + 40}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Summoned Gengar Card */}
      {isSummoned && (
        <div
          className="absolute -bottom-16 md:-bottom-20 z-20 animate-spooky-float cursor-pointer select-none"
          onClick={() => setIsSummoned(false)}
        >
          <div className="relative flex flex-col items-center">
            {/* Speech Bubble Arrow */}
            <div className="w-3 h-3 bg-purple-950/95 border-t border-l border-purple-500/30 rotate-45 translate-y-1.5 z-10" />
            
            <div className="bg-purple-950/95 border border-purple-500/30 rounded-xl p-2.5 shadow-2xl backdrop-blur-md min-w-[130px] max-w-[160px] text-center text-purple-200 animate-in zoom-in-75 slide-in-from-top-4 duration-300">
              {/* Detailed custom Gengar SVG */}
              <svg
                viewBox="0 0 100 100"
                className="w-14 h-14 mx-auto drop-shadow-[0_0_8px_rgba(168,85,247,0.9)] fill-current text-purple-500"
              >
                {/* Spikes / Back spines silhouette */}
                <path
                  d="M 15,25 Q 10,12 24,18 Q 36,4 50,15 Q 64,4 76,18 Q 90,12 85,25 Q 94,45 84,65 Q 88,85 70,80 Q 50,96 30,80 Q 12,85 16,65 Q 6,45 15,25 Z"
                  fill="#2e1065"
                  stroke="#a855f7"
                  strokeWidth="0.75"
                />
                
                {/* Menacing red eyes */}
                <path d="M 28,34 Q 38,36 43,45 Q 33,45 28,34 Z" fill="#ef4444" />
                <circle cx="39" cy="40" r="1.2" fill="white" />
                
                <path d="M 72,34 Q 62,36 57,45 Q 67,45 72,34 Z" fill="#ef4444" />
                <circle cx="61" cy="40" r="1.2" fill="white" />
                
                {/* Wide toothy white grin */}
                <path
                  d="M 33,56 C 38,72 62,72 67,56 C 50,60 50,60 33,56 Z"
                  fill="white"
                />
                {/* Mouth internal details / tooth outlines */}
                <path
                  d="M 33,56 C 38,59 62,59 67,56"
                  stroke="#7e22ce"
                  strokeWidth="1.2"
                  fill="none"
                />
                {/* Tooth separators */}
                <path
                  d="M 40,58 L 40,63 M 47,59 L 47,65 M 53,59 L 53,65 M 60,58 L 60,63"
                  stroke="#7e22ce"
                  strokeWidth="1"
                />
              </svg>
              
              <div className="mt-1.5 font-bold text-xs text-purple-400 tracking-wider">
                GENGAR
              </div>
              <div className="text-[10px] text-purple-300 font-medium italic mt-0.5 leading-snug">
                {quote}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
