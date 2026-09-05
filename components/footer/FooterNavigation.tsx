"use client";

import Link from "next/link";
import { footerColumns } from "@/data/footer";

/**
 * The footer's four columns.
 *
 * Every row is a real destination: an anchor on this page, another page on
 * this site, or an account the client runs. An anchor scrolls rather than
 * reloading — and holds still for anyone who has asked for less motion — while
 * a route change is left to `next/link` and an outbound link to the browser.
 *
 * One `nav`, four lists: a screen reader hears "Tours, list of 3 items", not
 * twelve links in a row with nothing to group them.
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
    <nav aria-label="Footer navigation" className="footer-columns">
      {footerColumns.map((column) => (
        <div key={column.label} className="footer-column">
          <h3 className="footer-column__label">{column.label}</h3>

          <ul className="footer-column__list">
            {column.links.map((link) => {
              const external = "external" in link && link.external;
              const anchor = link.href.startsWith("#");

              return (
                <li key={link.label}>
                  {anchor ? (
                    <a
                      href={link.href}
                      onClick={(event) => scrollToSection(event, link.href)}
                      className="footer-column__link"
                    >
                      {link.label}
                    </a>
                  ) : external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="footer-column__link"
                    >
                      {link.label}
                      <span aria-hidden className="footer-column__mark">
                        ↗
                      </span>
                    </a>
                  ) : (
                    <Link href={link.href} className="footer-column__link">
                      {link.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
