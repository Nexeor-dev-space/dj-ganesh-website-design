"use client";

import { footerNavLinks } from "@/data/footer";

/**
 * The one navigation the footer carries — a single quiet line of section
 * names. Each one scrolls the page rather than reloading it, and holds still
 * for anyone who has asked for less motion.
 */
export function FooterNavigation() {
  function scrollToSection(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
    const target = document.querySelector(href);
    if (!target) return; // Let the browser handle it rather than swallow the click.

    event.preventDefault();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", href);
  }

  return (
    <nav aria-label="Footer navigation">
      <ul className="flex flex-col gap-md sm:flex-row sm:flex-wrap sm:gap-x-xl sm:gap-y-sm">
        {footerNavLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              onClick={(event) => scrollToSection(event, link.href)}
              className="footer-link"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
