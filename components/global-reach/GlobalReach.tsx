"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { CityList } from "@/components/global-reach/CityList";
import { Container } from "@/components/layout/Container";
import { ShowInfo } from "@/components/global-reach/ShowInfo";
import { TourGlobe, type GlobeAnchor } from "@/components/global-reach/TourGlobe";
import { UpNext } from "@/components/global-reach/UpNext";
import {
  bookingEmail,
  countriesToured,
  tourCities as defaultCities,
  tourName as defaultTourName,
  tourShows as defaultShows,
} from "@/lib/tour";
import type { TourCity, TourShow } from "@/types/tour";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/**
 * Section 02 — Shows.
 *
 * The tour as a globe rather than a list. A lineup of dates answers "when",
 * but this section's real subject is reach — nine cities across five regions
 * — and a sphere says that in one glance where a column of rows cannot. So
 * the globe is the section: everything else is caption, set centred beneath
 * it, and no part of it repeats what the globe already shows.
 *
 * The section owns the one piece of shared state, which city is active. A
 * pointer hover previews a city while it lasts; a click or a tap pins one,
 * and it stays pinned until another is chosen, the panel is closed, the
 * empty globe is pressed or Escape is hit. Keyboard focus previews only when
 * the focus is visible, so a mouse click never leaves a city "hovered" by
 * its own focus. The hover clears on a short delay rather than at once, so
 * the pointer can cross the gap from a marker to its panel without the panel
 * vanishing on the way. Everything the globe can do is reachable from the
 * two strips underneath it.
 */

/** How long a hover survives after the pointer leaves, in ms. */
const HOVER_GRACE = 260;

export function GlobalReach({
  tourName = defaultTourName,
  tourCities = defaultCities,
  tourShows = defaultShows,
}: {
  tourName?: string;
  tourCities?: readonly TourCity[];
  tourShows?: readonly TourShow[];
} = {}) {
  // Memoised: the globe restarts if its route identity changes.
  const tourRoute = useMemo(() => tourShows.map((show) => show.city), [tourShows]);
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [pinnedCity, setPinnedCity] = useState<string | null>(null);
  const [anchor, setAnchor] = useState<GlobeAnchor | null>(null);

  const activeCity = hoveredCity ?? pinnedCity;
  const hoverTimer = useRef<number | null>(null);

  // A hover ends on a short delay; a new hover cancels the pending end.
  const hoverCity = useCallback((city: string | null) => {
    if (hoverTimer.current !== null) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    if (city === null) {
      hoverTimer.current = window.setTimeout(() => {
        setHoveredCity(null);
        hoverTimer.current = null;
      }, HOVER_GRACE);
    } else {
      setHoveredCity(city);
    }
  }, []);

  useEffect(
    () => () => {
      if (hoverTimer.current !== null) window.clearTimeout(hoverTimer.current);
    },
    [],
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // A press pins; pressing the empty globe, the panel's close or Escape
  // releases. Pressing the pinned city again keeps it — a toggle that undid
  // itself was the thing that felt broken.
  const selectCity = useCallback((city: string | null) => {
    setPinnedCity(city);
    if (city === null) setHoveredCity(null);
  }, []);

  const clearCity = useCallback(() => selectCity(null), [selectCity]);

  useEffect(() => {
    if (!pinnedCity) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") clearCity();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [pinnedCity, clearCity]);

  return (
    <section
      ref={sectionRef}
      id="global-reach"
      aria-labelledby="shows-title"
      data-visible={visible}
      className="shows section-block relative overflow-hidden"
    >
      <div className="global-glow" aria-hidden />
      <div className="overlay-grain pointer-events-none absolute inset-0" aria-hidden />

      <Container className="relative z-10">
        <p className="reveal-scroll shows__eyebrow" style={delay(0)}>
          {tourName}
        </p>

        <h2 id="shows-title" className="reveal-scroll section-title shows__title" style={delay(90)}>
          Shows
        </h2>

        {/* The instruction has to be true on the device reading it: a phone
            has no hover, and telling it to hover is an instruction it cannot
            follow. Both words are in the markup and CSS shows the one that
            applies, so the sentence is right either way and a screen reader
            still gets a single, whole sentence. */}
        <p className="reveal-scroll shows__sub" style={delay(170)}>
          <span className="shows__pointer" data-pointer="fine">
            Hover
          </span>
          <span className="shows__pointer" data-pointer="coarse">
            Tap
          </span>{" "}
          a city for the next show, date and tickets
        </p>

        <div className="reveal-scroll shows__stage" style={delay(260)}>
          <div className="shows__globe">
            <TourGlobe
              cities={tourCities}
              route={tourRoute}
              activeCity={activeCity}
              onHoverCity={hoverCity}
              onSelectCity={selectCity}
              onAnchorChange={setAnchor}
            />
          </div>

          {activeCity ? (
            <ShowInfo
              city={activeCity}
              anchor={anchor}
              shows={tourShows}
              pinned={pinnedCity === activeCity}
              onHover={hoverCity}
              onClose={clearCity}
            />
          ) : null}
        </div>

        <div className="reveal-scroll" style={delay(360)}>
          <CityList
            cities={tourCities}
            shows={tourShows}
            activeCity={activeCity}
            pinnedCity={pinnedCity}
            onHover={hoverCity}
            onSelect={selectCity}
          />
        </div>

        <div className="reveal-scroll" style={delay(450)}>
          <UpNext
            shows={tourShows}
            activeCity={activeCity}
            pinnedCity={pinnedCity}
            onHover={hoverCity}
            onSelect={selectCity}
          />
        </div>

        {/* The one verified figure the section carries, and the way in for a
            city that is not on the globe. Kept to a single quiet line: as a
            display number it read as a scoreboard. */}
        <p className="reveal-scroll shows__foot" style={delay(530)}>
          <span>
            {countriesToured.value} {countriesToured.label}
          </span>
          <span aria-hidden className="shows__foot-sep">
            ·
          </span>
          <a
            href={`mailto:${bookingEmail}?subject=${encodeURIComponent(
              `Booking enquiry — ${tourName}`,
            )}`}
            className="btn-tertiary shows__enquiry"
          >
            Not on the list? Bring DJ Ganesh to your city
            <span aria-hidden className="btn__arrow">
              &rarr;
            </span>
          </a>
        </p>
      </Container>
    </section>
  );
}
