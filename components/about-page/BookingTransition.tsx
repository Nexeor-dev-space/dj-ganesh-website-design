"use client";

import type { CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { useSectionVisible } from "@/components/about-page/useSectionVisible";
import { aboutOutro, bookingHref } from "@/data/about-page";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/**
 * The quiet hand-off to booking.
 *
 * Deliberately secondary: a question and a text link, ruled off from the story
 * above it. This page is here to introduce him, and a full-width booking pitch
 * at the end of it would be answering a question nobody asked yet.
 */
export function BookingTransition() {
  const [ref, visible] = useSectionVisible<HTMLElement>();

  return (
    <section
      ref={ref}
      aria-labelledby="about-outro-title"
      data-visible={visible}
      className="about-outro relative"
    >
      <Container className="relative z-10">
        <div className="about-outro__row">
          <h2
            id="about-outro-title"
            className="reveal-scroll about-outro__question"
            style={delay(0)}
          >
            {aboutOutro.question}
          </h2>

          <a
            href={bookingHref}
            data-cursor="book"
            className="reveal-scroll about-outro__cta group"
            style={delay(90)}
          >
            {aboutOutro.cta}
            <span
              aria-hidden
              className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5 motion-reduce:transition-none"
            >
              &rarr;
            </span>
          </a>
        </div>
      </Container>
    </section>
  );
}
