import type { CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { HeroBackground } from "@/components/hero/HeroBackground";
import { HeroSoundToggle } from "@/components/hero/HeroSoundToggle";
import { resolveHeroAudio } from "@/lib/media";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

export function Hero() {
  const audioSrc = resolveHeroAudio();

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative flex min-h-svh flex-col overflow-hidden"
    >
      <HeroBackground />

      {/* The lockup sits low and left, in the darkest part of the frame and
          well clear of his face and hands. */}
      <Container className="relative z-10 flex flex-1 flex-col justify-end pt-5xl pb-xl">
        <p
          className="reveal text-[10px] font-light uppercase tracking-[0.34em] text-accent md:text-[11px]"
          style={delay(650)}
        >
          BollyAfro Pioneer
        </p>

        <h1 id="hero-title" className="hero-title mt-md md:mt-lg">
          <span className="line-mask">
            <span style={delay(350)}>DJ Ganesh</span>
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

      {/* Utility rail — deliberately quiet */}
      <Container
        className="reveal-fade relative z-10 flex items-center justify-between gap-md pb-lg md:pb-xl"
        style={delay(1200)}
      >
        <HeroSoundToggle src={audioSrc} />

        <a
          href="#about"
          className="group hidden items-center gap-md text-[10px] font-light uppercase tracking-[0.24em] text-white/45 transition-colors duration-200 hover:text-accent sm:flex"
        >
          Scroll to explore
          <span className="scroll-line relative block h-8 w-px bg-white/15" aria-hidden />
        </a>
      </Container>
    </section>
  );
}
