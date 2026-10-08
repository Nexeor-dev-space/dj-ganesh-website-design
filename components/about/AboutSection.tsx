"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { AboutImage } from "@/components/about/AboutImage";
import { CareerStats } from "@/components/about/CareerStats";
import {
  aboutCta as defaultCta,
  aboutHeading as defaultHeading,
  aboutSectionLabel as defaultLabel,
  aboutStory as defaultStory,
  soundStrands as defaultStrandNames,
  strandDescriptions,
} from "@/lib/about";
import type { CareerStat } from "@/types/about";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

type SoundStrand = { name: string; description?: string };

const defaultStrands: readonly SoundStrand[] = defaultStrandNames.map((name) => ({
  name,
}));

/**
 * Section 04 — My Story.
 *
 * The story runs down the left and the stage frame off the right edge of the
 * screen, where it sticks while the text scrolls past it. The career figures
 * close the spread as one ruled band rather than as cards — an editorial
 * page, not an about box.
 */
export function AboutSection({
  aboutSectionLabel = defaultLabel,
  aboutHeading = defaultHeading,
  aboutStory = defaultStory,
  soundStrands = defaultStrands,
  aboutCta = defaultCta,
  aboutPortrait,
  careerStats,
}: {
  aboutSectionLabel?: string;
  aboutHeading?: readonly string[];
  aboutStory?: readonly string[];
  soundStrands?: readonly SoundStrand[];
  aboutCta?: { label: string; href: string };
  aboutPortrait?: { src: string; alt: string };
  careerStats?: readonly CareerStat[];
} = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  /** The strand whose paragraph stands in for the story, if any. */
  const [strand, setStrand] = useState<number | null>(null);
  /** Touch has no hover, so a tap toggles instead; a mouse click must not. */
  const pointerType = useRef("mouse");

  // A strand without its own copy borrows the default for its name, so the
  // CMS can rename or reorder them without the hover going blank.
  const strandCopy = soundStrands.map(
    ({ name, description }) => description ?? strandDescriptions[name],
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

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="about-title"
      data-visible={visible}
      className="section-block relative overflow-hidden"
    >
      <div className="story-glow" aria-hidden />

      <Container className="relative z-10">
        <p
          className="reveal-scroll text-[12px] font-light uppercase tracking-[0.34em] text-accent"
          style={delay(0)}
        >
          {aboutSectionLabel}
        </p>

        <div className="story-spread mt-eyebrow">
          {/* The frame leads on a phone, where a tall column of type before any
              picture would read as a wall of text. */}
          <div className="reveal-scroll order-1 lg:order-2" style={delay(200)}>
            <AboutImage aboutPortrait={aboutPortrait} />
          </div>

          <div className="order-2 lg:order-1">
            <h2
              id="about-title"
              className="story-title reveal-scroll"
              style={delay(120)}
            >
              {aboutHeading[0]}
              <br />
              <span className="text-accent">{aboutHeading[1]}</span>
              <br />
              {aboutHeading[2]}
            </h2>

            <div
              className="story-strands reveal-scroll mt-heading"
              style={delay(180)}
              data-picked={strand != null || undefined}
            >
              {soundStrands.map(({ name }, index) => (
                <span key={name} className="story-strand">
                  {index > 0 ? (
                    <span aria-hidden className="mr-sm text-white/20">
                      /
                    </span>
                  ) : null}
                  {strandCopy[index] ? (
                    <button
                      type="button"
                      className="story-strand__button"
                      data-current={strand === index || undefined}
                      aria-pressed={strand === index}
                      onPointerDown={(event) => {
                        pointerType.current = event.pointerType;
                      }}
                      onPointerEnter={(event) => {
                        if (event.pointerType === "mouse") setStrand(index);
                      }}
                      onPointerLeave={(event) => {
                        if (event.pointerType === "mouse") setStrand(null);
                      }}
                      onFocus={() => setStrand(index)}
                      onBlur={() => setStrand(null)}
                      onClick={() => {
                        if (pointerType.current === "mouse") return;
                        setStrand((current) => (current === index ? null : index));
                      }}
                    >
                      {name}
                    </button>
                  ) : (
                    name
                  )}
                </span>
              ))}
            </div>

            <div className="max-w-[54ch]">
              {/* Every version shares one grid cell, so the tallest sets the
                  height and swapping between them never moves the page. */}
              <div
                className="story-swap reveal-scroll mt-heading text-[15px] leading-relaxed text-muted-foreground md:text-[17px]"
                style={delay(260)}
                aria-live="polite"
              >
                <p data-shown={strand == null || undefined} aria-hidden={strand != null || undefined}>
                  {aboutStory[0]}
                </p>
                {strandCopy.map((copy, index) =>
                  copy ? (
                    <p
                      key={soundStrands[index].name}
                      data-shown={strand === index || undefined}
                      aria-hidden={strand !== index || undefined}
                    >
                      {copy}
                    </p>
                  ) : null,
                )}
              </div>

              <p
                className="reveal-scroll mt-lg text-[15px] leading-relaxed text-foreground md:text-[17px]"
                style={delay(320)}
              >
                {aboutStory[1]}
              </p>
            </div>

            <a
              href={aboutCta.href}
              data-cursor="book"
              className="reveal-scroll btn-tertiary mt-body"
              style={delay(380)}
            >
              {aboutCta.label}
              <span aria-hidden className="btn__arrow">
                &rarr;
              </span>
            </a>
          </div>
        </div>

        {/* The career in figures, ruled across the foot of the spread. */}
        <div className="reveal-scroll mt-block" style={delay(440)}>
          <CareerStats careerStats={careerStats} />
        </div>
      </Container>
    </section>
  );
}
