import type { CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { HeroBackground } from "@/components/hero/HeroBackground";
import { SocialIcon } from "@/components/navigation/SocialIcon";
import { bookingHref, socialLinks } from "@/lib/site";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/**
 * The banner.
 *
 * Built to the composition of the client's own site: the footage runs behind
 * the whole section, and the lockup sits centred on it in one column —
 * kicker, name, line, the booking button, the profiles, and the scroll cue at
 * the foot. That order is theirs; only the copy is this project's.
 *
 * Deliberately plainer than the sections below it: the name is set at a
 * readable display size rather than stretched to the width of the screen, and
 * the video is left to be the movement.
 */
export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="hero relative flex min-h-svh flex-col overflow-hidden"
    >
      <HeroBackground />

      <Container className="hero__inner relative z-10">
        <p className="hero__kicker reveal" style={delay(300)}>
          BollyAfro Pioneer
        </p>

        <h1 id="hero-title" className="hero__title reveal" style={delay(400)}>
          DJ Ganesh
        </h1>

        <p className="hero__sub reveal" style={delay(500)}>
          Est. 1998 · Mumbai, India
        </p>

        <div className="hero__ctas reveal" style={delay(600)}>
          <a href={bookingHref} className="hero__btn">
            Book DJ Ganesh
          </a>

          <a href="#music" className="hero__link">
            <span aria-hidden className="hero__link-mark">
              &#9654;
            </span>
            Listen to Music
          </a>
        </div>

        <ul className="hero__socials reveal" style={delay(700)}>
          {socialLinks.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={social.label}
              >
                <SocialIcon name={social.icon} className="h-[18px] w-auto" />
              </a>
            </li>
          ))}
        </ul>
      </Container>

      {/* Sits on the section rather than in the column, so it stays centred on
          the frame however the lockup above it wraps. */}
      <div className="hero__scroll reveal" style={delay(900)} aria-hidden>
        <span className="hero__scroll-line" />
      </div>
    </section>
  );
}
