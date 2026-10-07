import type { CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { RevealSection } from "@/components/layout/RevealSection";
import { bookingInfo, finalCta } from "@/data/contact";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/**
 * How to write a useful enquiry, then the last word.
 *
 * The two belong together: the note explains what to include, and the link
 * directly under it goes back to the form to include it. Kept to one section
 * so the page ends on a single beat rather than two small ones.
 */
export function FinalCta({
  info = bookingInfo,
  cta = finalCta,
}: {
  info?: { heading: string; copy: string };
  cta?: {
    heading: readonly string[];
    lede: string;
    label: string;
    href: string;
  };
} = {}) {
  return (
    <RevealSection
      aria-labelledby="final-title"
      className="section-block contact-final relative overflow-hidden"
    >
      <div className="contact-final__glow" aria-hidden />
      <div className="overlay-grain pointer-events-none absolute inset-0" aria-hidden />

      <Container className="relative z-10">
        <div className="reveal-scroll contact-note" style={delay(0)}>
          <h2 className="contact-note__title">{info.heading}</h2>
          <p className="contact-note__copy">{info.copy}</p>
        </div>

        <h2 id="final-title" className="contact-final__title">
          {cta.heading.map((line, index) => (
            <span
              key={line}
              className="reveal-scroll contact-final__line"
              style={delay(160 + index * 110)}
            >
              {line}
            </span>
          ))}
        </h2>

        <p className="reveal-scroll contact-final__lede" style={delay(420)}>
          {cta.lede}
        </p>

        <a
          href={cta.href}
          data-cursor="book"
          className="reveal-scroll btn-primary contact-final__cta"
          style={delay(500)}
        >
          <span>{cta.label}</span>
          <span aria-hidden className="btn__arrow">
            →
          </span>
        </a>
      </Container>
    </RevealSection>
  );
}
