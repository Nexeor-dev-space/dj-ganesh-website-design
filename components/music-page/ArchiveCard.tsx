"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { useMusicPlayer } from "@/components/music/MusicProvider";
import { formatTime, isDownloadable, youtubeWatchUrl } from "@/lib/music";
import type { Track } from "@/types/music";

type ArchiveCardProps = {
  track: Track;
  /** Position in the player's running order — what the transport is asked to play. */
  index: number;
  /** Stagger for the archive's entrance, in ms. */
  delay: number;
};

/**
 * One release in the archive.
 *
 * The same card the homepage section uses — artwork as the transport, the
 * genre as a filled chip, the title, the credit, the link out to the video —
 * and deliberately the same CSS rather than a copy of it: the two places show
 * the same four releases, so a visitor arriving from the homepage should find
 * the record they just saw, not a second design of it. Restyling the cards
 * there restyles them here.
 *
 * What the archive adds is what an archive is for: the running order, how long
 * each track is, how far through the current one is, and a download on any
 * release that genuinely carries a file. Those sit under the credit as a quiet
 * meta line, so they inform the card without changing what it is.
 */
export function ArchiveCard({ track, index, delay }: ArchiveCardProps) {
  const { currentIndex, isPlaying, currentTime, durations, toggle } =
    useMusicPlayer();
  /** The still is remote; the local cover art takes over if it fails. */
  const [stillFailed, setStillFailed] = useState(false);

  const isCurrent = index === currentIndex;
  const sounding = isCurrent && isPlaying;
  const duration = durations[track.id];

  return (
    <li
      className="release-card archive-card reveal-scroll"
      data-current={isCurrent || undefined}
      data-playing={sounding || undefined}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      <button
        type="button"
        onClick={() => toggle(index)}
        data-cursor="play"
        aria-pressed={sounding}
        aria-current={isCurrent ? "true" : undefined}
        aria-label={sounding ? `Pause ${track.title}` : `Play ${track.title}`}
        className="release-card__player"
      >
        <Image
          src={stillFailed ? track.artwork : track.thumbnail}
          onError={() => setStillFailed(true)}
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="release-card__art"
        />

        <span className="release-card__play" aria-hidden>
          {sounding ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </span>

        {sounding ? (
          <span className="eq release-card__eq" aria-hidden>
            <span />
            <span />
            <span />
          </span>
        ) : null}
      </button>

      <div className="release-card__info">
        <span className="release-card__tag">{track.tag}</span>
        <h3 className="release-card__title">{track.title}</h3>
        <p className="release-card__artist">{track.artist}</p>

        {/* The archive's own line: where this release sits in the running
            order, and how long it runs — with the elapsed time in front of it
            only on the track actually sounding. */}
        <p className="archive-card__meta">
          <span aria-hidden className="archive-card__no tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span aria-hidden className="archive-card__rule" />
          <span className="archive-card__time tabular-nums">
            {isCurrent ? (
              <>
                <span className={sounding ? "text-accent" : undefined}>
                  {formatTime(currentTime)}
                </span>
                <span aria-hidden className="archive-card__slash">
                  /
                </span>
              </>
            ) : null}
            {formatTime(duration)}
          </span>
        </p>

        <div className="archive-card__links">
          {/* Rendered for exactly the releases that carry a real file. None
              do today, so none show a download — see the note under the
              archive, which says so once rather than on every card. */}
          {isDownloadable(track) ? (
            <a
              href={track.downloadUrl}
              download
              aria-label={`Download ${track.title}`}
              className="release-card__ytlink"
            >
              Download
              <span aria-hidden className="release-card__arrow">
                ↓
              </span>
            </a>
          ) : null}

          <a
            href={youtubeWatchUrl(track.youtubeId)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Watch ${track.title} on YouTube — opens in a new tab`}
            className="release-card__ytlink"
          >
            Watch on YouTube
            <span aria-hidden className="release-card__arrow">
              ↗
            </span>
          </a>
        </div>
      </div>
    </li>
  );
}
