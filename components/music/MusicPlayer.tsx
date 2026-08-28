"use client";

import Image from "next/image";
import { useRef } from "react";
import { AudioVisualizer } from "@/components/music/AudioVisualizer";
import { useMusicPlayer } from "@/components/music/MusicProvider";
import { formatTime, youtubeWatchUrl } from "@/lib/music";

/** Keyboard seek step, in seconds. */
const SEEK_STEP = 5;

export function MusicPlayer() {
  const {
    currentTrack,
    currentIndex,
    tracks,
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
    <div className="flex flex-col gap-xl">
      <div className="flex flex-col gap-xl md:flex-row md:items-start md:gap-2xl">
        {/* Artwork */}
        <div className="relative w-full max-w-[420px] shrink-0 md:w-[46%] md:max-w-none">
          <div className="relative aspect-square overflow-hidden rounded-[2px] border border-border">
            <Image
              key={currentTrack.id}
              src={currentTrack.artwork}
              alt={`${currentTrack.title} — cover art`}
              fill
              sizes="(min-width: 768px) 46vw, 100vw"
              className="artwork-swap object-cover"
            />
            <div className="overlay-grain pointer-events-none absolute inset-0" aria-hidden />
            <div
              className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
                isPlaying ? "artwork-glow opacity-100" : "opacity-0"
              }`}
              aria-hidden
            />
          </div>

          {/* Channel indicator — a small nod to a DJ system, nothing more. */}
          <p className="mt-md flex items-center gap-sm text-[10px] font-light uppercase tracking-[0.28em] text-white/40">
            <span
              aria-hidden
              className={`block h-[5px] w-[5px] rounded-full ${
                isPlaying ? "bg-accent" : "bg-white/25"
              }`}
            />
            CH {String(currentIndex + 1).padStart(2, "0")} / {String(tracks.length).padStart(2, "0")}
          </p>
        </div>

        {/* Now playing */}
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="text-[10px] font-light uppercase tracking-[0.28em] text-accent">
            {currentTrack.tag}
          </p>
          <h3 className="font-display mt-sm text-[clamp(24px,3.4vw,40px)] font-bold uppercase leading-[1.05] tracking-[-0.03em]">
            {currentTrack.title}
          </h3>
          <p className="mt-sm text-[12px] font-light uppercase tracking-[0.18em] text-white/50">
            {currentTrack.artist}
          </p>

          {/* Waveform */}
          <AudioVisualizer className="mt-xl h-[56px] w-full md:h-[72px]" />

          {/* Progress */}
          <div className="mt-lg">
            <div
              ref={barRef}
              role="slider"
              tabIndex={0}
              aria-label="Seek"
              aria-valuemin={0}
              aria-valuemax={duration ? Math.round(duration) : 0}
              aria-valuenow={Math.round(currentTime)}
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
                } else if (event.key === "ArrowLeft") {
                  event.preventDefault();
                  seekBy(-SEEK_STEP);
                }
              }}
              className="progress-track group relative flex h-11 cursor-pointer items-center"
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

            <div className="flex items-center justify-between text-[10px] font-light tabular-nums tracking-[0.18em] text-white/45">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Transport */}
          <div className="mt-xl flex items-center gap-xl">
            <button
              type="button"
              onClick={previous}
              aria-label="Previous track"
              className="transport-button"
            >
              <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="currentColor">
                <path d="M7 6h2v12H7zM19 6v12l-9-6z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => toggle()}
              data-cursor="play"
              aria-label={isPlaying ? `Pause ${currentTrack.title}` : `Play ${currentTrack.title}`}
              aria-pressed={isPlaying}
              className="play-button"
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="currentColor">
                  <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden className="ml-[3px] h-5 w-5" fill="currentColor">
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
              <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="currentColor">
                <path d="M15 6h2v12h-2zM5 6l9 6-9 6z" />
              </svg>
            </button>

            <a
              href={youtubeWatchUrl(currentTrack.youtubeId)}
              target="_blank"
              rel="noreferrer noopener"
              className="ml-auto flex h-11 items-center text-[10px] font-light uppercase tracking-[0.22em] text-white/45 transition-colors duration-200 hover:text-accent"
            >
              Watch on YouTube <span aria-hidden>↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
