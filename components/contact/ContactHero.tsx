import type { CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { contactMeta } from "@/data/contact";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/**
 * The page's opening.
 *
 * First thing on the page, so it uses the banner's load reveal rather than the
 * scroll one — there is nothing to scroll into yet. Three elements and a great
 * deal of air: the statement is the design.
 */
export function ContactHero() {
  return (
    <section aria-labelledby="contact-title" className="contact-hero relative overflow-hidden">
      <div className="contact-hero__glow" aria-hidden />
      <div className="overlay-grain pointer-events-none absolute inset-0" aria-hidden />

      <Container className="relative z-10">
        <p className="reveal contact-hero__eyebrow" style={delay(150)}>
          {contactMeta.eyebrow}
        </p>

        <h1 id="contact-title" className="contact-hero__title">
          {contactMeta.heading.map((line, index) => (
            <span key={line} className="reveal contact-hero__line" style={delay(300 + index * 120)}>
              {line}
            </span>
          ))}
        </h1>

        <p className="reveal contact-hero__lede" style={delay(620)}>
          {contactMeta.lede}
        </p>
      </Container>
    </section>
  );
}
