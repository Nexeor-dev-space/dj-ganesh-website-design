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
type BookingTransitionProps = {
  question?: string;
  cta?: string;
  href?: string;
};

export function BookingTransition({
  question = aboutOutro.question,
  cta = aboutOutro.cta,
  href = bookingHref,
}: BookingTransitionProps = {}) {
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
            {question}
          </h2>

          <a
            href={href}
            data-cursor="book"
            className="reveal-scroll btn-primary about-outro__cta"
            style={delay(90)}
          >
            <span>{cta}</span>
            <span aria-hidden className="btn__arrow">
              &rarr;
            </span>
          </a>
        </div>
      </Container>
    </section>
  );
}
