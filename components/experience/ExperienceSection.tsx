"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { Offering } from "@/components/experience/Offering";
import {
  experienceHeading,
  experienceSectionLabel,
  offerings,
} from "@/data/experience";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/** Stagger between offerings, in ms. */
const STEP = 110;

/**
 * The Experience — the three things he is booked for.
 *
 * The one centred section on the page, as the client's own file sets it: the
 * label over the title over three equal plates, symmetrical rather than
 * ranged left. Everything else on the site is left-aligned, which is what
 * makes centring this one read as a deliberate stop rather than a default.
 *
 * The three cards carry no photograph. The only images the source has here are
 * generated stock, and a picture of somebody else is worse than none — so the
 * cards are told apart by their numbers, each set twice: once legibly in the
 * accent, once as a ghost across the card's corner.
 */
export function ExperienceSection() {
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
      id="experience"
      aria-labelledby="experience-title"
      data-visible={visible}
      className="section-block relative overflow-hidden"
    >
      <div className="experience-glow" aria-hidden />

      <Container className="relative z-10">
        <div className="experience-head">
          <p
            className="reveal-scroll text-[10px] font-light uppercase tracking-[0.34em] text-accent md:text-[11px]"
            style={delay(0)}
          >
            {experienceSectionLabel}
          </p>

          {/* One line, and the second word carries the accent — the two words
              are a single phrase here, not a two-line break like the ranged
              headings elsewhere. */}
          <h2
            id="experience-title"
            className="reveal-scroll section-title experience-title"
            style={delay(80)}
          >
            {experienceHeading[0]}{" "}
            <span className="experience-title__accent">
              {experienceHeading[1]}
            </span>
          </h2>
        </div>

        <ul className="exp-cards">
          {offerings.map((offering, index) => (
            <Offering
              key={offering.id}
              offering={offering}
              delay={240 + index * STEP}
            />
          ))}
        </ul>
      </Container>
    </section>
  );
}
