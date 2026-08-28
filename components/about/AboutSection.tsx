"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { AboutImage } from "@/components/about/AboutImage";
import {
  aboutCta,
  aboutHeading,
  aboutSectionLabel,
  aboutStory,
  soundStrands,
  storyFacts,
} from "@/lib/about";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/**
 * Section 04 — My Story.
 *
 * The spectacle of the globe and the deck gives way to the person: a portrait
 * holding the left of the spread with the heading stepped across its edge, and
 * the bio, its three dates and the booking line running down the right. On
 * phones the panel stacks — portrait first, then the story.
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

        <div className="mt-xl grid gap-2xl md:mt-2xl lg:grid-cols-[46fr_54fr] lg:items-center lg:gap-2xl xl:gap-xl">
          {/* Portrait — first in the flow, so it leads on phones too. */}
          <div className="reveal-scroll sm:max-w-[440px] md:max-w-[520px] lg:max-w-[560px]" style={delay(120)}>
            <AboutImage />
          </div>

          {/* Story — steps back over the portrait's edge from `lg` up. */}
          <div className="lg:pt-2xl xl:relative xl:z-10">
            <h2
              id="about-title"
              /* The one deliberate overlap: the heading alone steps back over
                 the portrait's edge. Everything below it stays in column. */
              className="story-title reveal-scroll xl:-ml-4xl"
              style={delay(200)}
            >
              {aboutHeading[0]}
              <br />
              <span className="text-accent">{aboutHeading[1]}</span>
              <br />
              {aboutHeading[2]}
            </h2>

            <p
              className="reveal-scroll mt-md text-[10px] font-light uppercase tracking-[0.28em] text-white/35 md:text-[11px]"
              style={delay(260)}
            >
              {soundStrands.join(" / ")}
            </p>

            <div className="max-w-[52ch]">
              <p
                className="reveal-scroll mt-xl text-[15px] leading-relaxed text-muted-foreground md:text-[17px]"
                style={delay(340)}
              >
                {aboutStory[0]}
              </p>

              <p
                className="reveal-scroll mt-lg text-[15px] leading-relaxed text-foreground md:text-[17px]"
                style={delay(400)}
              >
                {aboutStory[1]}
              </p>
            </div>

            {/* Editorial metadata rather than statistic cards. */}
            <dl
              className="reveal-scroll mt-2xl grid grid-cols-3 gap-md border-t border-border pt-lg sm:flex sm:flex-wrap sm:items-start sm:gap-x-2xl sm:gap-y-lg"
              style={delay(460)}
            >
              {storyFacts.map((fact) => (
                <div key={fact.value} className="min-w-0 sm:min-w-[92px]">
                  <dt className="font-display text-[24px] font-bold leading-none tracking-[-0.03em] sm:text-[26px] md:text-[32px]">
                    {fact.value}
                  </dt>
                  <dd className="mt-xs text-[10px] font-light uppercase tracking-[0.24em] text-white/45">
                    {fact.label}
                  </dd>
                </div>
              ))}
            </dl>

            <a
              href={aboutCta.href}
              data-cursor="book"
              className="reveal-scroll group mt-2xl inline-flex items-center gap-md border-b border-white/25 pb-sm text-[11px] font-light uppercase tracking-[0.24em] transition-colors duration-300 hover:border-accent hover:text-accent md:text-[12px]"
              style={delay(540)}
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
      </Container>
    </section>
  );
}
