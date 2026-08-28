import { Container } from "@/components/layout/Container";
import { navLinks, siteConfig } from "@/lib/site";

/**
 * Minimal transparent navigation that sits over the hero.
 * The mobile trigger is UI only — the full mobile menu is a later task.
 */
export function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-50 reveal-fade [--reveal-delay:200ms]">
      <Container as="nav" className="flex items-center justify-between py-md lg:py-lg">
        <a
          href="#hero"
          className="font-display text-[15px] font-bold uppercase tracking-[0.18em] lg:text-base"
        >
          {siteConfig.name}
        </a>

        <ul className="hidden items-center gap-xl lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[12px] uppercase tracking-[0.16em] text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className="border border-border px-md py-xs text-[12px] uppercase tracking-[0.16em] transition-colors duration-200 hover:border-white/40 hover:bg-white hover:text-background"
            >
              Book Now
            </a>
          </li>
        </ul>

        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={false}
          className="-mr-2 flex h-10 w-10 flex-col items-center justify-center gap-[6px] lg:hidden"
        >
          <span className="block h-px w-6 bg-foreground" />
          <span className="block h-px w-6 bg-foreground" />
        </button>
      </Container>
    </header>
  );
}
