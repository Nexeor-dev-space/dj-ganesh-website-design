"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { useMusicPlayer } from "@/components/music/MusicProvider";
import { youtubeWatchUrl } from "@/lib/music";
import type { Track } from "@/types/music";

type MusicCardProps = {
  track: Track;
  /** Position in the running order — what the player is asked to play. */
  index: number;
  /** Stagger for the grid's entrance, in ms. */
  delay: number;
};

/**
 * One release card: artwork with the transport on it, then the metadata.
 *
 * Rebuilt from the release cards on the client's own site — cover art in a
 * 16:9 frame, a round play button over it, the genre as a small filled chip,
 * the title as the card's strongest line, the credit under it, and the link
 * out to the video.
 *
 * Two controls, deliberately separate: the artwork is a button that plays the
 * local mix through the site's shared player, and the YouTube line is a link
 * that leaves for the video. The link sits outside the button rather than
 * inside it, so opening the video can never also start the audio — nothing
 * has to stop an event from propagating because nothing is nested.
 */
export function MusicCard({ track, index, delay }: MusicCardProps) {
  const { currentIndex, isPlaying, toggle } = useMusicPlayer();
  /** The still is remote; the local cover art takes over if it fails. */
  const [stillFailed, setStillFailed] = useState(false);

  const isCurrent = index === currentIndex;
  const sounding = isCurrent && isPlaying;

  return (
    <li
      className="release-card reveal-scroll"
      data-current={isCurrent || undefined}
      data-playing={sounding || undefined}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      <button
        type="button"
        onClick={() => toggle(index)}
        data-cursor="play"
        aria-pressed={sounding}
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

        {/* The only thing on the page that animates continuously, and only
            while its own track is sounding. */}
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
    </li>
  );
}
