"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { CityList } from "@/components/global-reach/CityList";
import { Container } from "@/components/layout/Container";
import { ShowInfo } from "@/components/global-reach/ShowInfo";
import { TourGlobe, type GlobeAnchor } from "@/components/global-reach/TourGlobe";
import { UpNext } from "@/components/global-reach/UpNext";
import { bookingEmail, countriesToured, tourName } from "@/lib/tour";

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
 * pointer hover wins while it lasts; a click, a tap or a keyboard focus pins
 * one, so a touch visitor keeps the panel open until they choose another and
 * a keyboard visitor drives the globe by tabbing the strip. Everything the
 * globe can do is reachable from the two strips underneath it.
 */
export function GlobalReach() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [pinnedCity, setPinnedCity] = useState<string | null>(null);
  const [anchor, setAnchor] = useState<GlobeAnchor | null>(null);

  const activeCity = hoveredCity ?? pinnedCity;

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

  // Pressing the pinned city again releases it, so a tap is its own undo.
  const selectCity = useCallback((city: string) => {
    setPinnedCity((current) => (current === city ? null : city));
  }, []);

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
              activeCity={activeCity}
              onHoverCity={setHoveredCity}
              onSelectCity={selectCity}
              onAnchorChange={setAnchor}
            />
          </div>

          {activeCity ? <ShowInfo city={activeCity} anchor={anchor} /> : null}
        </div>

        <div className="reveal-scroll" style={delay(360)}>
          <CityList
            activeCity={activeCity}
            onHover={setHoveredCity}
            onSelect={selectCity}
          />
        </div>

        <div className="reveal-scroll" style={delay(450)}>
          <UpNext
            activeCity={activeCity}
            onHover={setHoveredCity}
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
            className="shows__enquiry"
          >
            Not on the list? Bring DJ Ganesh to your city
            <span aria-hidden>&rarr;</span>
          </a>
        </p>
      </Container>
    </section>
  );
}
