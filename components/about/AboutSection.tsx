"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { AboutImage } from "@/components/about/AboutImage";
import { CareerStats } from "@/components/about/CareerStats";
import {
  aboutCta,
  aboutHeading,
  aboutSectionLabel,
  aboutStory,
  soundStrands,
} from "@/lib/about";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/**
 * Section 04 — My Story.
 *
 * The story runs down the left and the stage frame off the right edge of the
 * screen, where it sticks while the text scrolls past it. The career figures
 * close the spread as one ruled band rather than as cards — an editorial
 * page, not an about box.
 */
export function AboutSection() {
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
      id="about"
      aria-labelledby="about-title"
      data-visible={visible}
      className="section-block relative overflow-hidden"
    >
      <div className="story-glow" aria-hidden />

      <Container className="relative z-10">
        <p
          className="reveal-scroll text-[10px] font-light uppercase tracking-[0.34em] text-accent md:text-[11px]"
          style={delay(0)}
        >
          {aboutSectionLabel}
        </p>

        <div className="story-spread mt-xl md:mt-2xl">
          {/* The frame leads on a phone, where a tall column of type before any
              picture would read as a wall of text. */}
          <div className="reveal-scroll order-1 lg:order-2" style={delay(200)}>
            <AboutImage />
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

            <p className="story-strands reveal-scroll mt-lg" style={delay(180)}>
              {soundStrands.map((strand, index) => (
                <span key={strand}>
                  {index > 0 ? (
                    <span aria-hidden className="mr-sm text-white/20">
                      /
                    </span>
                  ) : null}
                  {strand}
                </span>
              ))}
            </p>

            <div className="max-w-[54ch]">
              <p
                className="reveal-scroll mt-xl text-[15px] leading-relaxed text-muted-foreground md:mt-2xl md:text-[17px]"
                style={delay(260)}
              >
                {aboutStory[0]}
              </p>

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
              className="reveal-scroll group mt-2xl inline-flex items-center gap-md border-b border-white/25 pb-sm text-[11px] font-light uppercase tracking-[0.24em] transition-colors duration-300 hover:border-accent hover:text-accent md:text-[12px]"
              style={delay(380)}
            >
              {aboutCta.label}
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5 motion-reduce:transition-none"
              >
                &rarr;
              </span>
            </a>
          </div>
        </div>

        {/* The career in figures, ruled across the foot of the spread. */}
        <div className="reveal-scroll mt-2xl md:mt-3xl" style={delay(440)}>
          <CareerStats />
        </div>
      </Container>
    </section>
  );
}
