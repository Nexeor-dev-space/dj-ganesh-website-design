"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import { CityList } from "@/components/global-reach/CityList";
import { TourCard } from "@/components/global-reach/TourCard";
import { UpNext } from "@/components/global-reach/UpNext";
import { TourGlobe, type GlobeAnchor } from "@/components/global-reach/TourGlobe";
import { countriesToured, tourName } from "@/lib/tour";

/**
 * Section 02 — Global Reach.
 *
 * Owns the one piece of shared state in the section: which city is active.
 * A pointer hover wins while it lasts; a click or tap pins a city so touch
 * users keep the card open until they choose another one.
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

  const selectCity = useCallback((city: string) => {
    setPinnedCity((current) => (current === city ? null : city));
  }, []);

  return (
    <section
      ref={sectionRef}
      id="global-reach"
      aria-labelledby="global-reach-title"
      data-visible={visible}
      className="section-block relative overflow-hidden"
    >
      <div className="global-scan" aria-hidden />
      <div className="global-sweep" aria-hidden />
      <div className="global-glow" aria-hidden />
      <div className="overlay-grain pointer-events-none absolute inset-0" aria-hidden />

      <Container className="relative z-10">
        <p
          className="reveal-scroll text-[10px] font-light uppercase tracking-[0.34em] text-accent md:text-[11px]"
          style={{ "--reveal-delay": "0ms" } as React.CSSProperties}
        >
          02 — Global Reach
        </p>

        <div className="mt-lg flex flex-col gap-lg md:mt-xl md:flex-row md:items-end md:justify-between md:gap-2xl">
          <h2
            id="global-reach-title"
            className="reveal-scroll section-title"
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
          >
            Global
            <br />
            Reach
          </h2>

          <p
            className="reveal-scroll flex items-baseline gap-md md:flex-col md:items-end md:gap-xs md:text-right"
            style={{ "--reveal-delay": "160ms" } as React.CSSProperties}
          >
            <span className="font-display text-[40px] font-bold leading-none tracking-[-0.04em] text-accent md:text-[64px]">
              {countriesToured.value}
            </span>
            <span className="text-[10px] font-light uppercase tracking-[0.28em] text-white/50 md:text-[11px]">
              {countriesToured.label}
            </span>
          </p>
        </div>

        {/* The card is anchored inside this box on desktop and falls below the
            globe in flow on phones, where a floating panel would crowd it. */}
        <div
          className="reveal-scroll relative mt-2xl md:mt-3xl"
          style={{ "--reveal-delay": "240ms" } as React.CSSProperties}
        >
          <div className="relative h-[300px] sm:h-[400px] md:h-[clamp(440px,46vw,620px)]">
            <TourGlobe
              activeCity={activeCity}
              onHoverCity={setHoveredCity}
              onSelectCity={selectCity}
              onAnchorChange={setAnchor}
            />

            <p className="pointer-events-none absolute left-0 top-0 text-[10px] font-light uppercase tracking-[0.28em] text-white/35">
              {tourName}
            </p>
          </div>

          {activeCity ? <TourCard city={activeCity} anchor={anchor} /> : null}
        </div>

        <div
          className="reveal-scroll mt-2xl md:mt-3xl"
          style={{ "--reveal-delay": "320ms" } as React.CSSProperties}
        >
          <CityList
            activeCity={activeCity}
            onHover={setHoveredCity}
            onSelect={selectCity}
          />
        </div>

        <div
          className="reveal-scroll mt-2xl md:mt-3xl"
          style={{ "--reveal-delay": "400ms" } as React.CSSProperties}
        >
          <UpNext
            activeCity={activeCity}
            onHover={setHoveredCity}
            onSelect={selectCity}
          />
        </div>
      </Container>
    </section>
  );
}
