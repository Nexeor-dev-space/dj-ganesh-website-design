"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { CityList } from "@/components/global-reach/CityList";
import { Container } from "@/components/layout/Container";
import { UpNext } from "@/components/global-reach/UpNext";
import { countriesToured } from "@/lib/tour";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/**
 * Section 02 — Global Reach.
 *
 * A tour board rather than a map. The globe that used to sit here was the
 * showpiece of the section, but it answered the wrong question: a visitor
 * arrives wanting to know where he is playing next and how to get in, and the
 * dates were pushed below the fold underneath a canvas that needed a precise
 * pointer to read. The dates now lead, set as a lineup — the city carries the
 * display type and the date is its caption — and the circuit follows as a
 * loose run of the nine cities with their bearings.
 *
 * Nothing here is interactive state, so the section holds none: it renders the
 * same markup on the server and only tracks whether it has scrolled into view.
 */
export function GlobalReach() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

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

  return (
    <section
      ref={sectionRef}
      id="global-reach"
      aria-labelledby="global-reach-title"
      data-visible={visible}
      className="section-block relative overflow-hidden"
    >
      <div className="global-glow" aria-hidden />
      <div className="overlay-grain pointer-events-none absolute inset-0" aria-hidden />

      <Container className="relative z-10">
        <p
          className="reveal-scroll text-[10px] font-light uppercase tracking-[0.34em] text-accent md:text-[11px]"
          style={delay(0)}
        >
          Global Reach
        </p>

        <div className="mt-lg flex flex-col gap-xl md:mt-xl md:flex-row md:items-end md:justify-between md:gap-2xl">
          <h2
            id="global-reach-title"
            className="reveal-scroll section-title"
            style={delay(80)}
          >
            Global
            <br />
            Reach
          </h2>

          {/* One figure, not a row of them — three numbers side by side read
              as a scoreboard rather than a statement. */}
          <p
            className="reveal-scroll flex items-baseline gap-md md:flex-col md:items-end md:gap-xs md:text-right"
            style={delay(160)}
          >
            <span className="font-display text-[40px] font-bold leading-none tracking-[-0.04em] text-accent md:text-[64px]">
              {countriesToured.value}
            </span>
            <span className="text-[10px] font-light uppercase tracking-[0.28em] text-white/50 md:text-[11px]">
              {countriesToured.label}
            </span>
          </p>
        </div>

        <div className="reveal-scroll mt-2xl md:mt-3xl" style={delay(240)}>
          <UpNext />
        </div>

        <div className="reveal-scroll mt-3xl md:mt-4xl" style={delay(320)}>
          <h3 className="text-[10px] font-light uppercase tracking-[0.32em] text-white/35 md:text-[11px]">
            The Circuit
          </h3>
          <CityList />
        </div>
      </Container>
    </section>
  );
}
