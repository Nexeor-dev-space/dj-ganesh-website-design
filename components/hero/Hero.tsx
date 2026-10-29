import type { CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { HeroBackground } from "@/components/hero/HeroBackground";
import { bookingHref } from "@/lib/site";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/**
 * The banner.
 *
 * Built to the composition of the client's own site: the footage runs behind
 * the whole section, and the lockup sits centred on it in one column —
 * kicker, name, line, the booking button, and the scroll cue at the foot.
 * The profiles are not repeated here; the navigation above already carries
 * them.
 *
 * The footage is left almost unshaded through the middle and the name is set
 * large enough to own the frame; the type carries its own shadow rather than
 * dimming the video to make room for it.
 */
export function Hero({
  videoSrc,
  poster,
  kicker = "Wedding DJ & BollyAfro Pioneer",
  name = "DJ Ganesh",
  primaryCta = { label: "Book DJ Ganesh", href: bookingHref },
  secondaryCta = { label: "Listen to Music", href: "#music" },
}: {
  videoSrc?: string;
  poster?: string;
  /** The line above the name; CMS Home Page → Hero → Line Above the Name. */
  kicker?: string;
  name?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
} = {}) {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="hero relative flex min-h-svh flex-col overflow-hidden"
    >
      <HeroBackground videoSrc={videoSrc} poster={poster} />

      <Container className="hero__inner relative z-10">
        <p className="hero__kicker reveal" style={delay(300)}>
          {kicker}
        </p>

        <h1 id="hero-title" className="hero__title reveal" style={delay(400)}>
          {name}
        </h1>

        <div className="hero__ctas reveal" style={delay(600)}>
          {/* Both carry the site's sweep: the label is wrapped so it drifts
              with the panel rather than sitting still under it. */}
          <a href={primaryCta.href} data-cursor="book" className="btn-primary">
            <span>{primaryCta.label}</span>
          </a>

          <a href={secondaryCta.href} className="btn-secondary">
            <span aria-hidden className="btn__mark">
              &#9654;
            </span>
            <span>{secondaryCta.label}</span>
          </a>
        </div>

      </Container>

      {/* Sits on the section rather than in the column, so it stays centred on
          the frame however the lockup above it wraps. */}
      <div className="hero__scroll reveal" style={delay(900)} aria-hidden>
        <span className="hero__scroll-line" />
      </div>
    </section>
  );
}
