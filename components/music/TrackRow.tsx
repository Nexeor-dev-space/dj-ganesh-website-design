"use client";

import { useMusicPlayer } from "@/components/music/MusicProvider";
import { formatTime } from "@/lib/music";
import type { Track } from "@/types/music";

type TrackRowProps = {
  track: Track;
  index: number;
};

export function TrackRow({ track, index }: TrackRowProps) {
  const { currentIndex, isPlaying, toggle, durations } = useMusicPlayer();

  const isActive = index === currentIndex;
  const isCurrentlyPlaying = isActive && isPlaying;
  const duration = durations[track.id];

  return (
    <button
      type="button"
      onClick={() => toggle(index)}
      data-cursor="play"
      data-active={isActive}
      aria-current={isActive ? "true" : undefined}
      aria-label={
        isCurrentlyPlaying ? `Pause ${track.title}` : `Play ${track.title}`
      }
      className="track-row group"
    >
      {/* Index / playing indicator */}
      <span className="track-row__index" aria-hidden>
        {isCurrentlyPlaying ? (
          <span className="eq" aria-hidden>
            <span />
            <span />
            <span />
          </span>
        ) : (
          String(index + 1).padStart(2, "0")
        )}
      </span>

      <span className="min-w-0 flex-1 text-left">
        <span className="track-row__title">{track.title}</span>
        <span className="track-row__meta">
          <span className="track-row__tag">{track.tag}</span>
          <span aria-hidden className="text-white/20">·</span>
          <span className="truncate">{track.artist}</span>
        </span>
      </span>

      {duration ? (
        <span className="track-row__time tabular-nums">{formatTime(duration)}</span>
      ) : null}

      <span className="track-row__icon" aria-hidden>
        {isCurrentlyPlaying ? (
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
            <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </span>
    </button>
  );
}
