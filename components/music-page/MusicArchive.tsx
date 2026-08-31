"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { TrackRow } from "@/components/music-page/TrackRow";
import { useMusicPlayer } from "@/components/music/MusicProvider";
import { useSectionVisible } from "@/components/about-page/useSectionVisible";
import { musicPageLabels } from "@/data/music-page";
import {
  ALL_CATEGORY,
  categories,
  downloadableCount,
  filterTracks,
} from "@/lib/music";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/** Stagger between rows, in ms. */
const STEP = 70;

/**
 * 03 — The archive.
 *
 * Every track on the site as a ruled index, with the category chips and the
 * search field that used to live on a separate Downloads page above it. That
 * page listed the same four tracks with the same controls in a different
 * layout; there is one archive, and this is it.
 *
 * Filtering is presentational only: the player still holds the full running
 * order, so a row's index — and what Next plays after it — is its position in
 * the archive, not its position in the filtered view.
 */
export function MusicArchive() {
  const [ref, visible] = useSectionVisible<HTMLElement>();
  const { tracks } = useMusicPlayer();

  const [category, setCategory] = useState<string>(ALL_CATEGORY);
  const [query, setQuery] = useState("");

  const shown = useMemo(
    () => filterTracks(tracks, category, query),
    [tracks, category, query],
  );

  return (
    <section
      ref={ref}
      id="all-music"
      aria-labelledby="archive-title"
      data-visible={visible}
      className="section-block music-archive relative overflow-hidden"
    >
      <div className="overlay-grain pointer-events-none absolute inset-0" aria-hidden />

      <Container className="relative z-10">
        <div className="music-archive__head">
          <div>
            <p className="reveal-scroll music-label" style={delay(0)}>
              {musicPageLabels.archive}
            </p>
            <h2 id="archive-title" className="reveal-scroll section-title" style={delay(80)}>
              The Full
              <br />
              Archive
            </h2>
          </div>

          <p className="reveal-scroll music-archive__note" style={delay(160)}>
            Every track plays here in full — pressing, credit and transport
            on each one.
          </p>
        </div>

        {/* Filter and search */}
        <div className="reveal-scroll controls-bar" style={delay(200)}>
          <div className="controls-cats" role="group" aria-label="Category">
            {categories.map((name) => {
              const active = name === category;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setCategory(name)}
                  aria-pressed={active}
                  className="controls-cat"
                  data-active={active || undefined}
                >
                  {name}
                </button>
              );
            })}
          </div>

          <div className="controls-search">
            <label htmlFor="archive-search" className="sr-only">
              Search the archive by title, category or artist
            </label>
            <input
              id="archive-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search music"
              className="controls-search__input"
            />
            <span aria-hidden className="controls-search__rule" />
          </div>
        </div>

        {/* Announced, since the list updates as you type. */}
        <p aria-live="polite" className="sr-only">
          {shown.length} of {tracks.length} tracks shown
        </p>

        {shown.length > 0 ? (
          <ul className="music-archive__list">
            {shown.map((track, position) => (
              <TrackRow
                key={track.id}
                track={track}
                /* The player's own index, not the filtered one: the row has to
                   play the right track however the archive is narrowed. */
                index={tracks.findIndex((entry) => entry.id === track.id)}
                delay={240 + position * STEP}
              />
            ))}
          </ul>
        ) : (
          <p className="archive-empty">Nothing in the archive matches that.</p>
        )}

        {/* Said once, plainly, rather than as an empty state on every row. */}
        {downloadableCount === 0 ? (
          <p className="reveal-scroll music-archive__downloads" style={delay(320)}>
            Every track streams in full. Downloadable files have not been
            released yet — when they are, they appear on the tracks that carry
            them.
          </p>
        ) : null}
      </Container>
    </section>
  );
}
