"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { useMusicPlayer } from "@/components/music/MusicProvider";
import { SocialIcon } from "@/components/navigation/SocialIcon";
import { youtubeWatchUrl } from "@/lib/music";

/** Disc sliding out of the sleeve; playback starts once it is clear. */
const PULL_MS = 950;
/** Disc sliding back in. */
const RETURN_MS = 720;
/** Sleeves trading places along the rack. */
const SLIDE_MS = 650;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Sharpest first: YouTube's 1280×720 still, then the 480×360 one every video
 * has, then the local artwork. Not every upload has the large still, so each
 * failure steps one down the list.
 */
function artSources(track: { youtubeId: string; thumbnail: string; artwork: string }) {
  return [
    `https://i.ytimg.com/vi/${track.youtubeId}/maxresdefault.jpg`,
    track.thumbnail,
    track.artwork,
  ];
}

/** Shortest signed distance from the active sleeve, wrapping round the rack. */
function wrapOffset(index: number, active: number, count: number) {
  let offset = (((index - active) % count) + count) % count;
  if (offset > count / 2) offset -= count;
  return offset;
}

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Section 03's releases as records in their sleeves.
 *
 * One sleeve at the centre with its neighbours in at the edges. Clicking the
 * sleeve slides the record out — rolling as it goes, the way a disc leaves a
 * real sleeve — and the track starts only once it is clear. Pause runs that
 * backwards: the audio stops, the platter halts where it is, and the record
 * slides home.
 *
 * Moving along the rack while a record is out puts it away first, then pulls
 * the next one out before that one plays, so two tracks never overlap. All of
 * it sits on the section's one `MusicProvider` element, which is what makes
 * that a guarantee rather than a matter of timing.
 */
export function VinylCarousel({
  style,
  spotifyUrl,
  playlist = false,
}: {
  style?: CSSProperties;
  /** The artist page; every release links to it. */
  spotifyUrl: string;
  /** Lists every release under the player; a row plays through the rack. */
  playlist?: boolean;
}) {
  const { tracks, currentIndex, isPlaying, toggle } = useMusicPlayer();
  const count = tracks.length;

  const [active, setActive] = useState(0);
  /** True from the moment a record starts out until it is back in. */
  const [out, setOut] = useState(false);
  /** How far down `artSources` each track has had to fall. */
  const [fallback, setFallback] = useState<Record<string, number>>({});

  // The track running out rolls the player on to the next one; the rack
  // follows it so the record that is out is always the one sounding.
  const [seenIndex, setSeenIndex] = useState(currentIndex);
  if (seenIndex !== currentIndex) {
    setSeenIndex(currentIndex);
    if (out && currentIndex !== active) setActive(currentIndex);
  }

  // Timers fire after renders have moved on, so they read the latest values
  // from here rather than from the closure they were scheduled in.
  const live = useRef({ currentIndex, isPlaying, active, out, toggle });
  useEffect(() => {
    live.current = { currentIndex, isPlaying, active, out, toggle };
  });

  const timers = useRef<number[]>([]);
  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };
  const later = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, reducedMotion() ? 0 : ms));
  };
  useEffect(() => clearTimers, []);

  const play = (index: number) => {
    const { currentIndex: current, isPlaying: playing, toggle: run } = live.current;
    if (index !== current) run(index);
    else if (!playing) run();
  };

  const pause = () => {
    if (live.current.isPlaying) live.current.toggle();
  };

  const pullOut = (index: number) => {
    clearTimers();
    setOut(true);
    later(PULL_MS, () => play(index));
  };

  const putBack = () => {
    clearTimers();
    pause();
    setOut(false);
  };

  const go = (step: number) => {
    const wasOut = live.current.out;
    const target = (((live.current.active + step) % count) + count) % count;
    clearTimers();

    if (!wasOut) {
      setActive(target);
      return;
    }

    pause();
    setOut(false);
    later(RETURN_MS, () => {
      setActive(target);
      later(SLIDE_MS, () => pullOut(target));
    });
  };

  /**
   * A playlist row: bring that sleeve to the centre and pull its record out.
   * A record already out goes home first, as with the arrows, so two never
   * play over each other. The row that is already sounding pauses instead.
   */
  const playFromList = (target: number) => {
    const { active: current, out: isOut } = live.current;
    if (target === current) {
      if (isOut) putBack();
      else pullOut(target);
      return;
    }

    clearTimers();
    const slideThenPull = () => {
      setActive(target);
      later(SLIDE_MS, () => pullOut(target));
    };

    if (!isOut) {
      slideThenPull();
      return;
    }

    pause();
    setOut(false);
    later(RETURN_MS, slideThenPull);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") go(-1);
    else if (event.key === "ArrowRight") go(1);
    else return;
    event.preventDefault();
  };

  const track = tracks[active];
  const sounding = out && isPlaying && currentIndex === active;

  return (
    <div
      className="reveal-scroll vinyl"
      style={style}
      role="region"
      aria-roledescription="carousel"
      aria-label="Latest releases"
      onKeyDown={onKeyDown}
    >
      <div className="vinyl__stage" data-out={out || undefined}>
        {tracks.map((item, index) => {
          const offset = wrapOffset(index, active, count);
          const isActive = offset === 0;
          const sources = artSources(item);
          const step = Math.min(fallback[item.id] ?? 0, sources.length - 1);
          const art = sources[step];
          /** The small still is 4:3 with the 16:9 frame letterboxed inside. */
          const still = step === 1 || undefined;
          const onError = () =>
            setFallback((current) => ({ ...current, [item.id]: step + 1 }));

          return (
            <div
              key={item.id}
              className="vinyl__item"
              data-active={isActive || undefined}
              data-far={Math.abs(offset) > 1 || undefined}
              data-out={(isActive && out) || undefined}
              data-spinning={(isActive && sounding) || undefined}
              style={{ "--offset": offset } as CSSProperties}
              aria-hidden={!isActive || undefined}
            >
              {/* The record, under the sleeve until it is pulled. */}
              <span className="vinyl__disc" aria-hidden>
                <span className="vinyl__platter">
                  <span className="vinyl__label">
                    <Image
                      src={art}
                      alt=""
                      fill
                      sizes="160px"
                      quality={90}
                      className="vinyl__label-art"
                      data-still={still}
                    />
                  </span>
                </span>
                <span className="vinyl__spindle" />
              </span>

              <button
                type="button"
                className="vinyl__sleeve"
                tabIndex={isActive ? 0 : -1}
                data-cursor="play"
                aria-pressed={isActive ? out : undefined}
                aria-label={
                  isActive
                    ? `${out ? "Pause" : "Play"} ${item.title}`
                    : `Show ${item.title}`
                }
                onClick={() => {
                  if (!isActive) go(offset);
                  else if (out) putBack();
                  else pullOut(index);
                }}
              >
                <Image
                  src={art}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 380px, 64vw"
                  quality={90}
                  className="vinyl__art"
                  data-still={still}
                  onError={onError}
                />
              </button>
            </div>
          );
        })}

        <button
          type="button"
          className="vinyl__arrow vinyl__arrow--prev"
          onClick={() => go(-1)}
          aria-label="Previous release"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
        </button>
        <button
          type="button"
          className="vinyl__arrow vinyl__arrow--next"
          onClick={() => go(1)}
          aria-label="Next release"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>

      <div className="vinyl__controls">
        <p className="vinyl__count" aria-hidden>
          {pad(active + 1)}
          <span>/{pad(count)}</span>
        </p>

        <button
          type="button"
          className="vinyl__toggle"
          data-playing={out || undefined}
          onClick={() => (out ? putBack() : pullOut(active))}
          aria-label={`${out ? "Pause" : "Play"} ${track.title}`}
        >
          {out ? (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
          <span>{out ? "Pause" : "Play"}</span>
          {sounding ? (
            <span className="eq" aria-hidden>
              <span />
              <span />
              <span />
            </span>
          ) : null}
        </button>
      </div>

      <div key={track.id} className="vinyl__info" aria-live="polite">
        <span className="release-card__tag">{track.tag}</span>
        <h3 className="release-card__title">{track.title}</h3>
        <p className="release-card__artist">{track.artist}</p>

        <div className="vinyl__links">
          <a
            href={youtubeWatchUrl(track.youtubeId)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Watch ${track.title} on YouTube — opens in a new tab`}
            className="btn-tertiary release-card__ytlink"
          >
            Watch on YouTube
            <SocialIcon name="youtube" className="btn__brand" />
          </a>

          <a
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Listen to DJ Ganesh on Spotify — opens in a new tab"
            className="btn-tertiary release-card__ytlink"
          >
            Listen on Spotify
            <SocialIcon name="spotify" className="btn__brand" />
          </a>
        </div>
      </div>

      {playlist ? (
        <div className="playlist">
          <h3 className="playlist__title">Playlist</h3>

          <ol className="playlist__list">
            {tracks.map((item, index) => {
              const current = index === active;
              const playing = current && sounding;

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className="playlist__row"
                    data-current={current || undefined}
                    data-playing={playing || undefined}
                    aria-pressed={playing}
                    aria-label={`${playing ? "Pause" : "Play"} ${item.title}`}
                    onClick={() => playFromList(index)}
                  >
                    <span className="playlist__thumb">
                      <Image
                        src={item.thumbnail}
                        alt=""
                        fill
                        sizes="48px"
                        className="playlist__thumb-art"
                      />
                      {playing ? (
                        <span className="eq playlist__eq" aria-hidden>
                          <span />
                          <span />
                          <span />
                        </span>
                      ) : null}
                    </span>

                    <span className="playlist__text">
                      <span className="playlist__name">{item.title}</span>
                      <span className="playlist__artist"> — {item.artist}</span>
                    </span>

                    <span className="playlist__tag">{item.tag}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      ) : null}
    </div>
  );
}
