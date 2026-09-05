"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { StageMarquee } from "@/components/stages/StageMarquee";
import {
  stageRows,
  stagesCtaHref,
  stagesCtaLabel,
  stagesHeading,
  stagesLede,
  stagesSectionLabel,
} from "@/lib/stages";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/** Seconds for one pass, per row. Longer rows travel slower. */
const DURATIONS = [46, 56, 50];

/**
 * Stages — the rooms behind the residency.
 *
 * The darkest band on the page: the ground drops below the page's own black
 * and the room names come up out of it in white. Three rows travelling in
 * alternating directions, no photograph and no outlined type — the wall of
 * names is the image.
 *
 * It was the site's one inverted section, a full field of the brand green with
 * every name in ink. Turned dark it stops shouting over the sections either
 * side of it, and the accent goes back to being an accent: the eyebrow, the
 * separators between names, and whichever name the pointer stops the wall on.
 *
 * Announced dates live in section 02 with their own ticket links, so this
 * band deliberately carries none; the only way out is the enquiry.
 */
export function StagesSection() {
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
      id="stages"
      aria-labelledby="stages-title"
      data-visible={visible}
      className="stages-section relative overflow-hidden"
    >
      <div className="stages-glow" aria-hidden />

      {/* The site's own grain, laid over the type as well as the ground — see
          globals.css. */}
      <div
        className="overlay-grain pointer-events-none absolute inset-0"
        aria-hidden
      />

      <Container className="relative z-10">
        <p className="reveal-scroll stages-label" style={delay(0)}>
          {stagesSectionLabel}
        </p>

        <div className="mt-lg flex flex-col gap-md md:mt-xl md:flex-row md:items-end md:justify-between md:gap-2xl">
          <h2
            id="stages-title"
            className="reveal-scroll section-title stages-title"
            style={delay(80)}
          >
            {stagesHeading[0]}
            <br />
            {stagesHeading[1]}
          </h2>

          <p className="reveal-scroll stages-lede" style={delay(160)}>
            {stagesLede}
          </p>
        </div>
      </Container>

      {/* Every row now, since nothing shares the band with them. */}
      <div className="reveal-scroll stages-band" style={delay(240)}>
        {stageRows.map((stages, index) => (
          <StageMarquee
            key={index}
            stages={stages}
            direction={index === 1 ? "right" : "left"}
            duration={DURATIONS[index] ?? 48}
          />
        ))}
      </div>

      <Container className="relative z-10">
        <a
          href={stagesCtaHref}
          data-cursor="book"
          className="reveal-scroll stages-cta"
          style={delay(320)}
        >
          {stagesCtaLabel}
          <span aria-hidden className="stages-cta__arrow">
            &rarr;
          </span>
        </a>
      </Container>
    </section>
  );
}
