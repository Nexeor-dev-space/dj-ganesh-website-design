import type { CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { HeroBackground } from "@/components/hero/HeroBackground";
import { SoundToggle } from "@/components/audio/SoundToggle";
import { FitText } from "@/components/hero/FitText";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative flex min-h-svh flex-col overflow-hidden"
    >
      <HeroBackground />

      {/* Volume control — clear of the navigation above and the lockup below. */}
      <Container className="pointer-events-none absolute inset-x-0 top-[84px] z-20 flex justify-end md:top-[108px]">
        <SoundToggle className="pointer-events-auto reveal [--reveal-delay:1100ms]" />
      </Container>

      {/* The lockup sits low and left, in the darkest part of the frame and
          well clear of his face and hands. */}
      <Container className="relative z-10 flex flex-1 flex-col justify-end pt-5xl pb-lg">
        <p
          className="reveal text-[10px] font-light uppercase tracking-[0.34em] text-accent md:text-[11px]"
          style={delay(650)}
        >
          BollyAfro Pioneer
        </p>

        <h1 id="hero-title" className="hero-title mt-md md:mt-lg text-accent">
          <span className="line-mask">
            <FitText style={delay(350)}>DJ Ganesh</FitText>
          </span>
        </h1>

        <p
          className="reveal mt-lg text-[11px] font-light uppercase tracking-[0.22em] text-white/60 md:mt-xl md:text-[12px]"
          style={delay(800)}
        >
          Est. 1998 · Mumbai, India
        </p>

        <div className="reveal mt-xl flex flex-col items-start gap-lg sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2xl sm:gap-y-md"
          style={delay(950)}>
          <a
            href="#contact"
            className="group flex items-center gap-md border-b border-white/25 pb-sm text-[11px] font-light uppercase tracking-[0.24em] transition-colors duration-300 hover:border-accent hover:text-accent md:text-[12px]"
          >
            Book DJ Ganesh
            <span
              aria-hidden
              className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5 motion-reduce:transition-none"
            >
              &rarr;
            </span>
          </a>

          <a
            href="#music"
            className="text-[11px] font-light uppercase tracking-[0.24em] text-white/45 transition-colors duration-300 hover:text-accent md:text-[12px]"
          >
            Listen to Music
          </a>
        </div>
      </Container>
    </section>
  );
}
