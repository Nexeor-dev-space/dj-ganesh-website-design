"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { Testimonial } from "@/components/testimonials/Testimonial";
import {
  testimonials,
  testimonialsHeading,
  testimonialsSectionLabel,
} from "@/lib/testimonials";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/**
 * Section 07 — Testimonials.
 *
 * The career is on record; this is what it felt like from the floor — and the
 * floor does not hold still, so neither does this. The quotes run as a band
 * across the full width of the page, right to left, forever: the heading stays
 * in the container, the run breaks out of it and dissolves at both edges, so
 * the section reads as something passing through rather than a list that ends.
 *
 * There is still nothing to operate. The band is not a slider — no arrows, no
 * dots, no timer, no state beyond whether the section has been seen. It slows
 * to a stop under the pointer instead, which is the only control three short
 * quotes need, and the card under the pointer is the one that comes forward.
 *
 * The quotes are rendered twice. The track travels exactly half its width and
 * starts over, which is seamless only because both halves are identical — the
 * spacing lives inside each card rather than in a flex `gap`, so the two ends
 * meet without half a gap between them. The second run is `aria-hidden`, so
 * each voice is announced once.
 */
export function TestimonialsSection() {
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

  const places = testimonials.map((voice) => voice.location).join(" · ");

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      aria-labelledby="testimonials-title"
      data-visible={visible}
      className="section-block reaction-section relative overflow-hidden"
    >
      <div className="reaction-glow" aria-hidden />
      <div className="overlay-grain pointer-events-none absolute inset-0" aria-hidden />

      <Container className="relative z-10">
        <p
          className="reveal-scroll text-[10px] font-light uppercase tracking-[0.34em] text-accent md:text-[11px]"
          style={delay(0)}
        >
          {testimonialsSectionLabel}
        </p>

        <div className="mt-lg flex flex-col gap-md md:mt-xl md:flex-row md:items-end md:justify-between md:gap-2xl">
          <h2
            id="testimonials-title"
            className="reveal-scroll section-title"
            style={delay(80)}
          >
            {testimonialsHeading[0]}
            <br />
            {testimonialsHeading[1]}
          </h2>

          {/* Built from the quotes themselves rather than restated. */}
          <p
            className="reveal-scroll text-[10px] font-light uppercase tracking-[0.28em] text-white/55 md:text-right md:text-[11px]"
            style={delay(160)}
          >
            {places}
          </p>
        </div>
      </Container>

      {/* Out of the container and across the whole page: the run has no left
          or right edge of its own, it only fades out of one. */}
      <div
        className="reveal-scroll reaction-run relative z-10"
        style={delay(240)}
      >
        <div className="reaction-run__viewport">
          <div className="reaction-run__track">
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                className="reaction-run__half"
                /* The second run exists only to close the loop. */
                aria-hidden={copy === 1 || undefined}
              >
                {testimonials.map((testimonial) => (
                  <Testimonial key={testimonial.id} testimonial={testimonial} />
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
