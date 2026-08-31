"use client";

import type { CSSProperties } from "react";
import { TrackDisc } from "@/components/music/TrackDisc";
import { useMusicPlayer } from "@/components/music/MusicProvider";
import { formatTime, isDownloadable, youtubeWatchUrl } from "@/lib/music";
import type { Track } from "@/types/music";

type TrackRowProps = {
  track: Track;
  index: number;
  /** Stagger for the archive's entrance, in ms. */
  delay: number;
};

/**
 * One release in the archive, given the room a feature used to get.
 *
 * The page carried a single large pressing at the top and a compact index
 * beneath it, which meant the disc always showed a different track from the
 * row you were reading. Every entry now carries its own: the pressing, the
 * catalogue number and tag, the title at display scale, the credit, and the
 * transport — so the record you are looking at is the record you play.
 *
 * The disc turns only while this track is the one sounding, and only this
 * row's control is filled in the accent, so the page still reads as one thing
 * playing rather than four buttons competing.
 */
export function TrackRow({ track, index, delay }: TrackRowProps) {
  const { currentIndex, isPlaying, currentTime, durations, toggle } =
    useMusicPlayer();

  const isCurrent = index === currentIndex;
  const sounding = isCurrent && isPlaying;
  const downloadable = isDownloadable(track);
  const duration = durations[track.id];

  return (
    <li
      className="track-card reveal-scroll"
      data-current={isCurrent || undefined}
      data-playing={sounding || undefined}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {/* The pressing. Decorative: everything it says is set beside it, and
          the control that operates it is a real button below. */}
      <div className="track-card__disc">
        <TrackDisc artwork={track.artwork} focused={isCurrent} spinning={sounding} />
      </div>

      <div className="track-card__detail">
        <p className="track-card__index">
          {sounding ? (
            <span className="eq" aria-hidden>
              <span />
              <span />
              <span />
            </span>
          ) : (
            <span aria-hidden className="tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
          <span aria-hidden className="track-card__rule" />
          {track.tag}
        </p>

        <h3 className="track-card__title">{track.title}</h3>
        <p className="track-card__artist">{track.artist}</p>

        <div className="track-card__actions">
          <button
            type="button"
            onClick={() => toggle(index)}
            data-cursor="play"
            aria-current={isCurrent ? "true" : undefined}
            aria-pressed={sounding}
            aria-label={sounding ? `Pause ${track.title}` : `Play ${track.title}`}
            className="track-card__play btn-sweep"
          >
            <span className="track-card__play-glyph" aria-hidden>
              {sounding ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </span>
            <span aria-hidden>{sounding ? "Pause" : "Play"}</span>
          </button>

          {/* Elapsed only for the track being played; the rest simply state
              how long they run. */}
          <p className="track-card__time">
            {isCurrent ? (
              <>
                <span className={sounding ? "text-accent" : undefined}>
                  {formatTime(currentTime)}
                </span>
                <span aria-hidden className="mx-xs text-white/20">
                  /
                </span>
              </>
            ) : null}
            {formatTime(duration)}
          </p>

          {downloadable ? (
            <a
              href={track.downloadUrl}
              download
              aria-label={`Download ${track.title}`}
              className="track-card__link"
            >
              Download <span aria-hidden>↓</span>
            </a>
          ) : null}

          <a
            href={youtubeWatchUrl(track.youtubeId)}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`Watch ${track.title} on YouTube`}
            className="track-card__link"
          >
            Watch on YouTube <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </li>
  );
}
