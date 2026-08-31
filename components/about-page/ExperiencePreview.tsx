"use client";

import type { CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { useSectionVisible } from "@/components/about-page/useSectionVisible";
import {
  aboutPageLabels,
  experienceHref,
  experiencePreview,
} from "@/data/about-page";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/**
 * Three entries from the archive, as a taster for the full history.
 *
 * Years, titles and ledes come straight from `lib/legacy.ts`; the link points
 * at a page that does not exist yet, which is why it is a plain anchor.
 */
export function ExperiencePreview() {
  const [ref, visible] = useSectionVisible<HTMLElement>();

  return (
    <section
      ref={ref}
      aria-labelledby="about-experience-title"
      data-visible={visible}
      className="section-block about-experience relative"
    >
      <Container className="relative z-10">
        <div className="flex flex-col gap-md md:flex-row md:items-end md:justify-between md:gap-2xl">
          <div>
            <p className="reveal-scroll about-label" style={delay(0)}>
              {aboutPageLabels.experience}
            </p>

            <h2
              id="about-experience-title"
              className="reveal-scroll section-title mt-lg md:mt-xl"
              style={delay(80)}
            >
              Selected
              <br />
              Nights
            </h2>
          </div>

          <a
            href={experienceHref}
            className="reveal-scroll about-more group"
            style={delay(160)}
          >
            Explore experience
            <span
              aria-hidden
              className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5 motion-reduce:transition-none"
            >
              &rarr;
            </span>
          </a>
        </div>

        <ol className="about-nights">
          {experiencePreview.map((milestone, index) => (
            <li
              key={milestone.id}
              className="reveal-scroll about-night"
              style={delay(240 + index * 90)}
            >
              <span className="about-night__year">{milestone.year}</span>
              <h3 className="about-night__title">{milestone.title}</h3>
              <p className="about-night__lede">{milestone.lede}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
