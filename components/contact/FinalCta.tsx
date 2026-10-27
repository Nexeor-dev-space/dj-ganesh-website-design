import type { CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { RevealSection } from "@/components/layout/RevealSection";
import { bookingInfo } from "@/data/contact";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/**
 * How to write a useful enquiry — the note the page ends on, under the form
 * and the direct contacts.
 */
export function FinalCta({
  info = bookingInfo,
}: {
  info?: { heading: string; copy: string };
} = {}) {
  return (
    <RevealSection
      aria-labelledby="note-title"
      className="section-block contact-final relative overflow-hidden"
    >
      <div className="contact-final__glow" aria-hidden />
      <div className="overlay-grain pointer-events-none absolute inset-0" aria-hidden />

      <Container className="relative z-10">
        <div className="reveal-scroll contact-note" style={delay(0)}>
          <h2 id="note-title" className="contact-note__title">{info.heading}</h2>
          <p className="contact-note__copy">{info.copy}</p>
        </div>
      </Container>
    </RevealSection>
  );
}
