"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { useSectionVisible } from "@/components/about-page/useSectionVisible";
import {
  journeyHeading,
  journeyLabel,
  journeyPhotos,
  type JourneyPhoto,
} from "@/data/journey";
import { itemKey } from "@/lib/keys";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/** Stagger across the sheet, in ms. */
const STEP = 70;

/**
 * The career in photographs, straight under the bio it illustrates.
 *
 * One ruled sheet like the homepage gallery — a hairline between frames, each
 * held a shade down until pointed at — but captioned, since these frames carry
 * no titles of their own. Portraits stand 4:5; a landscape frame spans two
 * columns so it stands as tall as the portraits beside it.
 */
type JourneySectionProps = {
  label?: string;
  heading?: string;
  photos?: readonly JourneyPhoto[];
};

export function JourneySection({
  label = journeyLabel,
  heading = journeyHeading,
  photos = journeyPhotos,
}: JourneySectionProps = {}) {
  const [ref, visible] = useSectionVisible<HTMLElement>();

  return (
    <section
      ref={ref}
      aria-labelledby="about-journey-title"
      data-visible={visible}
      className="section-block journey relative"
    >
      <Container className="relative z-10">
        <p className="reveal-scroll about-label" style={delay(0)}>
          {label}
        </p>
        <h2
          id="about-journey-title"
          className="reveal-scroll section-title mt-eyebrow"
          style={delay(60)}
        >
          {heading}
        </h2>

        <ul className="journey__grid">
          {photos.map((photo, index) => (
            <li
              key={itemKey(photo.src, index)}
              className={`journey__item reveal-scroll${
                photo.landscape ? " journey__item--landscape" : ""
              }`}
              style={delay(120 + index * STEP)}
            >
              <figure className="journey__figure">
                <div className="journey__frame" data-cursor="explore">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes={
                      photo.landscape
                        ? "(min-width: 1440px) 720px, (min-width: 1024px) 50vw, 100vw"
                        : "(min-width: 1440px) 360px, (min-width: 1024px) 25vw, 50vw"
                    }
                    quality={90}
                    className="journey__img"
                  />
                </div>
                {photo.caption ? (
                  <figcaption className="journey__caption">{photo.caption}</figcaption>
                ) : null}
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
