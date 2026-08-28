"use client";

import { useBackgroundAudio } from "@/components/audio/BackgroundAudioProvider";

/**
 * Top-right volume control for the background mix. It only ever mutes or
 * unmutes — the mix keeps looping either way, so there is no restart glitch
 * when the visitor turns it back on.
 */
export function SoundToggle({ className }: { className?: string }) {
  const { src, isMuted, toggle } = useBackgroundAudio();

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={!src}
      aria-pressed={!isMuted}
      aria-label={
        !src
          ? "Background mix not available yet"
          : isMuted
            ? "Play background music"
            : "Mute background music"
      }
      className={[
        "flex h-10 w-10 items-center justify-center rounded-xl text-white/70 transition-colors duration-200",
        "hover:bg-white/10 hover:text-accent disabled:cursor-not-allowed disabled:text-white/25 disabled:hover:bg-transparent",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="h-[18px] w-[18px]"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 9.5v5h3.5L13 19V5L7.5 9.5H4Z" />
        {isMuted ? (
          <path d="m16.5 9.5 4 4m0-4-4 4" />
        ) : (
          <path d="M16.3 8.7a5 5 0 0 1 0 6.6M18.8 6a8.5 8.5 0 0 1 0 12" />
        )}
      </svg>
    </button>
  );
}
