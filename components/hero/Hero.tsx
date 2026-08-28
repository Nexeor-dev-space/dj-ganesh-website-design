import { Container } from "@/components/layout/Container";
import { HeroBackground } from "@/components/hero/HeroBackground";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowDownIcon, ArrowRightIcon, socialIcons } from "@/components/ui/Icons";
import { socialLinks } from "@/lib/site";

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative flex min-h-svh flex-col overflow-hidden"
    >
      <HeroBackground />

      {/* Editorial content — left aligned, vertically centred */}
      <Container className="relative z-10 flex flex-1 items-end pt-3xl pb-2xl md:pt-4xl md:pb-3xl lg:items-center">
        <div className="w-full max-w-[700px]">
          <p
            className="reveal text-[11px] uppercase tracking-[0.22em] text-muted-foreground md:text-[12px]"
            style={{ "--reveal-delay": "400ms" } as React.CSSProperties}
          >
            BollyAfro Pioneer · Est. 1998
          </p>

          <h1
            id="hero-title"
            className="hero-title reveal mt-md"
            style={{ "--reveal-delay": "500ms" } as React.CSSProperties}
          >
            {/* Stacked deliberately — the name reads as a poster lockup and
                stays on two lines at every breakpoint. */}
            <span className="block">DJ</span>
            <span className="block">Ganesh</span>
          </h1>

          <div
            className="reveal mt-lg max-w-[520px]"
            style={{ "--reveal-delay": "700ms" } as React.CSSProperties}
          >
            <p className="text-lg font-medium tracking-tight text-foreground md:text-2xl">
              India&apos;s #1 Celebrity &amp; Wedding DJ
            </p>
            <p className="mt-sm text-[13px] leading-relaxed text-muted-foreground md:text-sm">
              28 years behind the decks · 5000+ events · 45+ countries
            </p>
          </div>

          <div
            className="reveal mt-xl flex flex-col items-start gap-md sm:flex-row sm:items-center sm:gap-2xl"
            style={{ "--reveal-delay": "900ms" } as React.CSSProperties}
          >
            <ButtonLink href="#contact">
              Book DJ Ganesh
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
            </ButtonLink>

            <ButtonLink href="#music" variant="ghost">
              Explore Music
              <ArrowDownIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-y-1 motion-reduce:transition-none" />
            </ButtonLink>
          </div>
        </div>
      </Container>

      {/* Utility rail — socials + scroll indicator */}
      <Container
        className="reveal-fade relative z-10 flex items-end justify-between gap-md pb-lg md:pb-xl"
        style={{ "--reveal-delay": "1100ms" } as React.CSSProperties}
      >
        <ul className="flex items-center gap-lg">
          {socialLinks.map((social) => {
            const Icon = socialIcons[social.icon];
            return (
              <li key={social.href}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${social.label} — opens in a new tab`}
                  className="block text-white/55 transition-colors duration-200 hover:text-foreground"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              </li>
            );
          })}
        </ul>

        <a
          href="#music"
          className="group hidden items-center gap-md text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors duration-200 hover:text-foreground sm:flex"
        >
          Scroll to explore
          <span className="scroll-line relative block h-10 w-px bg-white/20" />
        </a>
      </Container>
    </section>
  );
}
