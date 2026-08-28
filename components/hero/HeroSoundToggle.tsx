"use client";

import { useEffect, useRef, useState } from "react";

type HeroSoundToggleProps = {
  /** Resolved at build time; null when no mix has been supplied yet. */
  src: string | null;
};

/**
 * Small editorial sound control. Nothing plays until the visitor asks —
 * there is no autoplay, so no browser policy to fight and no surprise audio.
 */
export function HeroSoundToggle({ src }: HeroSoundToggleProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const stop = () => setIsPlaying(false);
    audio.addEventListener("pause", stop);
    audio.addEventListener("ended", stop);
    return () => {
      audio.removeEventListener("pause", stop);
      audio.removeEventListener("ended", stop);
    };
  }, []);

  async function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    } else {
      audio.pause();
    }
  }

  const label = isPlaying ? "Pause" : "Play";

  return (
    <div className="flex items-center gap-sm">
      <span className="text-[10px] font-light tracking-[0.24em] text-white/35">01</span>
      <span className="block h-px w-6 bg-white/20" aria-hidden />
      <button
        type="button"
        onClick={toggle}
        disabled={!src}
        aria-pressed={isPlaying}
        aria-label={src ? `${label} the hero mix` : "Hero mix not available yet"}
        className="group flex items-center gap-sm text-[10px] font-light uppercase tracking-[0.24em] text-white/70 transition-colors duration-200 hover:text-accent disabled:cursor-not-allowed disabled:text-white/25 disabled:hover:text-white/25"
      >
        <span
          aria-hidden
          className={[
            "block h-[5px] w-[5px] rounded-full transition-colors duration-200",
            src
              ? isPlaying
                ? "animate-pulse bg-accent motion-reduce:animate-none"
                : "bg-white/40 group-hover:bg-accent"
              : "bg-white/20",
          ].join(" ")}
        />
        {src ? label : "Sound"}
      </button>

      {src && <audio ref={audioRef} src={src} preload="none" loop />}
    </div>
  );
}
