import { Container } from "@/components/layout/Container";
import { navLinks, siteConfig } from "@/lib/site";

/**
 * Compact art-directed navigation that sits over the hero photograph.
 * No bar, no background — it reads as part of the artwork.
 * The mobile trigger is UI only; the full menu is a later task.
 */
export function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-50 reveal [--reveal-delay:250ms]">
      <Container
        as="nav"
        aria-label="Primary"
        className="flex items-center justify-between py-md lg:py-lg"
      >
        <a
          href="#hero"
          className="font-display text-[13px] font-bold uppercase tracking-[0.3em] transition-colors duration-200 hover:text-accent"
        >
          {siteConfig.name}
        </a>

        <ul className="hidden items-center gap-2xl lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="group relative block py-xs text-[11px] font-light uppercase tracking-[0.24em] text-white/80 transition-colors duration-200 hover:text-accent"
              >
                {link.label}
                <span className="absolute inset-x-0 -bottom-px block h-px origin-left scale-x-0 bg-accent transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 motion-reduce:transition-none" />
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="hidden text-[11px] font-light uppercase tracking-[0.24em] text-foreground transition-colors duration-200 hover:text-accent lg:block"
        >
          Book DJ
        </a>

        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={false}
          className="-mr-2 flex h-10 w-10 flex-col items-end justify-center gap-[7px] lg:hidden"
        >
          <span className="block h-px w-7 bg-foreground" />
          <span className="block h-px w-5 bg-foreground" />
        </button>
      </Container>
    </header>
  );
}
