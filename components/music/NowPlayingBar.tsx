"use client";

import Image from "next/image";
import { useRef } from "react";
import { AudioVisualizer } from "@/components/music/AudioVisualizer";
import { useMusicPlayer } from "@/components/music/MusicProvider";
import { formatTime, youtubeWatchUrl } from "@/lib/music";

/** Keyboard seek step, in seconds. */
const SEEK_STEP = 5;

/**
 * The transport, kept to a single strip under the archive.
 *
 * Everything the old card carried — sleeve, title, waveform, scrubber, time
 * and the YouTube link — reduced to one line, so the list stays the section's
 * subject and the deck reads as an instrument rather than a player widget.
 */
export function NowPlayingBar() {
  const {
    currentTrack,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    toggle,
    seek,
    seekBy,
    next,
    previous,
  } = useMusicPlayer();

  const barRef = useRef<HTMLDivElement>(null);
  const progress = duration ? Math.min(currentTime / duration, 1) : 0;

  function seekFromPointer(clientX: number) {
    const bar = barRef.current;
    if (!bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    seek(Math.min(Math.max(ratio, 0), 1) * duration);
  }

  return (
    <div className="now-playing">
      <div className="flex flex-wrap items-center gap-x-lg gap-y-md">
        {/* Sleeve */}
        <div className="relative hidden h-14 w-14 shrink-0 overflow-hidden border border-border sm:block">
          <Image
            key={currentTrack.id}
            src={currentTrack.artwork}
            alt=""
            fill
            sizes="56px"
            className="artwork-swap object-cover"
          />
          <div
            className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
              isPlaying ? "artwork-glow opacity-100" : "opacity-0"
            }`}
            aria-hidden
          />
        </div>

        {/* Transport */}
        <div className="flex items-center gap-sm">
          <button
            type="button"
            onClick={previous}
            aria-label="Previous track"
            className="transport-button"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
              <path d="M7 6h2v12H7zM19 6v12l-9-6z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => toggle()}
            data-cursor="play"
            aria-pressed={isPlaying}
            aria-label={isPlaying ? `Pause ${currentTrack.title}` : `Play ${currentTrack.title}`}
            className="play-button"
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4 translate-x-[1px]" fill="currentColor" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Next track"
            className="transport-button"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
              <path d="M15 6h2v12h-2zM5 6l9 6-9 6z" />
            </svg>
          </button>
        </div>

        {/* Title + waveform — its own line on phones, where a single row
            would squeeze the title down to two letters. */}
        <div className="order-first w-full min-w-0 md:order-none md:w-auto md:flex-1">
          <p className="flex items-baseline gap-sm text-[11px] font-light uppercase tracking-[0.24em]">
            <span className="text-white/35 tabular-nums">
              {String(currentIndex + 1).padStart(2, "0")}
            </span>
            <span className="truncate text-foreground">{currentTrack.title}</span>
          </p>
          <AudioVisualizer className="mt-sm hidden h-6 w-full md:block" />
        </div>

        <p className="shrink-0 text-[11px] font-light tabular-nums text-white/45">
          <span className={isPlaying ? "text-accent" : undefined}>
            {formatTime(currentTime)}
          </span>
          <span aria-hidden className="mx-xs text-white/20">
            /
          </span>
          {formatTime(duration)}
        </p>

        <a
          href={youtubeWatchUrl(currentTrack.youtubeId)}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`Watch ${currentTrack.title} on YouTube`}
          className="hidden shrink-0 text-[10px] font-light uppercase tracking-[0.24em] text-white/45 transition-colors duration-200 hover:text-accent lg:block"
        >
          YouTube <span aria-hidden>↗</span>
        </a>
      </div>

      {/* Scrubber */}
      <div
        ref={barRef}
        role="slider"
        tabIndex={0}
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={duration ?? 0}
        aria-valuenow={Math.floor(currentTime)}
        aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          seekFromPointer(event.clientX);
        }}
        onPointerMove={(event) => {
          if (event.buttons === 1) seekFromPointer(event.clientX);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            seekBy(SEEK_STEP);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            seekBy(-SEEK_STEP);
          }
        }}
        className="progress-track group relative mt-md flex h-11 cursor-pointer items-center"
      >
        <span className="relative block h-px w-full bg-white/15">
          <span
            className="absolute inset-y-0 left-0 bg-accent"
            style={{ width: `${progress * 100}%` }}
          />
          <span
            className="progress-thumb absolute top-1/2 h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
            style={{ left: `${progress * 100}%` }}
          />
        </span>
      </div>
    </div>
  );
}
