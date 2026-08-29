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
 * Where each card samples the shared texture, and how it sits once it lands —
 * the same hand-laid treatment the tour dates use, held a shade flatter
 * because these cards are taller and a steeper angle would close the gaps.
 */
const CROPS = ["24% 30%", "72% 62%", "40% 84%"] as const;
const TILTS = ["-1.4deg", "1deg", "-0.8deg"] as const;
const DRIFTS = ["0px", "14px", "-6px"] as const;

/**
 * The Experience — the three things he is booked for.
 *
 * Three cards, on the same stock the tour dates are printed on: texture
 * behind, an accent badge, the title at display scale, what the booking
 * includes, and a pill out to the booking section. No photographs — the only
 * images the client's own file carries here are generated stock, and a
 * picture of somebody else is worse than none.
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
        <p
          className="reveal-scroll text-[10px] font-light uppercase tracking-[0.34em] text-accent md:text-[11px]"
          style={delay(0)}
        >
          {experienceSectionLabel}
        </p>

        <div className="mt-lg flex flex-col gap-md md:mt-xl md:flex-row md:items-end md:justify-between md:gap-2xl">
          <h2
            id="experience-title"
            className="reveal-scroll section-title"
            style={delay(80)}
          >
            {experienceHeading[0]}
            <br />
            {experienceHeading[1]}
          </h2>

          <p
            className="reveal-scroll text-[10px] font-light uppercase tracking-[0.28em] text-white/45 md:max-w-[34ch] md:text-right md:text-[11px]"
            style={delay(160)}
          >
            Weddings · Residencies · Live shows — every one of them ends at the
            same booking form.
          </p>
        </div>

        <ul className="offer-cards">
          {offerings.map((offering, index) => (
            <Offering
              key={offering.id}
              offering={offering}
              crop={CROPS[index % CROPS.length]}
              tilt={TILTS[index % TILTS.length]}
              drift={DRIFTS[index % DRIFTS.length]}
              delay={240 + index * STEP}
            />
          ))}
        </ul>
      </Container>
    </section>
  );
}
