"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { MenuMarquee } from "@/components/navigation/MenuMarquee";
import { SocialIcon } from "@/components/navigation/SocialIcon";
import { bookingHref, navLinks, siteConfig, socialLinks } from "@/lib/site";
import {
  hasText,
  mapNavLinks,
  mapSocials,
  useSiteData,
} from "@/components/site/SiteDataProvider";
import type { SocialLink } from "@/types/site";

/**
 * Fixed navigation bar: outlined wordmark on the left, social rail, a single
 * accent call-to-action and a hamburger that opens the full-screen menu.
 * Links live in the overlay so the bar itself stays quiet at every width.
 *
 * The overlay is one centred column: the pages, then three rows of the rooms
 * and the names he is trusted by running edge to edge, then the accounts as
 * labelled pills — so the menu vouches for him on the way to wherever it
 * sends the visitor.
 *
 * Every destination is a route, so they are `next/link` rather than plain
 * anchors — the menu now moves between pages, and a full document load on each
 * one would throw away the fonts, the audio and the rest of the shell. The
 * page currently open is marked with `aria-current`, which is what the accent
 * on it means.
 */
export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const site = useSiteData();
  const links: readonly { label: string; href: string }[] =
    mapNavLinks(site.nav) ?? navLinks;
  const socials: readonly SocialLink[] = mapSocials(site.socials) ?? socialLinks;
  const bookHref = hasText(site.contact?.bookingCtaUrl)
    ? site.contact.bookingCtaUrl
    : bookingHref;

  // Freeze the page behind the overlay and let Escape close it.
  useEffect(() => {
    if (!open) return;

    // The menu is its own scroller and keeps its offset while hidden, so a
    // menu scrolled down last time reopened below HOME. Start at the top.
    document.querySelector("#primary-menu .menu")?.scrollTo(0, 0);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <Container
          as="nav"
          aria-label="Primary"
          className="flex h-16 items-center justify-between gap-md md:h-20"
        >
          {/* Wordmark */}
          <Link
            href="/"
            aria-label={`${siteConfig.name} — home`}
            onClick={(event) => {
              // Already home: a link to the same page goes nowhere, so the
              // wordmark would do nothing. Glide back to the top instead,
              // dropping any #section and closing the menu.
              if (pathname !== "/") return;
              event.preventDefault();
              setOpen(false);
              if (window.location.hash) {
                window.history.replaceState(null, "", "/");
              }
              const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
              window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
            }}
            className="group inline-flex items-center px-4 py-2 transition-opacity duration-200 hover:opacity-80 md:px-6 md:py-2.5"
          >
            <span className="font-display text-[13px] font-bold uppercase leading-none tracking-[0.28em] md:text-[15px]">
              DJ<span className="text-accent">&nbsp;Ganesh</span>
            </span>
          </Link>

          <div className="flex items-center gap-sm">
            <ul className="hidden items-center gap-xs sm:flex">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-white/70 transition-colors duration-200 hover:bg-white/10 hover:text-accent"
                  >
                    <SocialIcon name={social.icon} className="h-5 w-auto" />
                  </a>
                </li>
              ))}
            </ul>

            <Link href={bookHref} className="btn-primary btn--sm">
              <svg
                viewBox="0 0 24 24"
                aria-hidden
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <circle cx="12" cy="8.5" r="3.5" />
                <path d="M4.8 19.5a7.2 7.2 0 0 1 14.4 0" strokeLinecap="round" />
              </svg>
              <span>Book</span>
            </Link>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="primary-menu"
              className="ml-xs flex h-10 w-10 flex-col items-center justify-center gap-[7px]"
            >
              <span
                className={`block h-[2px] w-7 bg-foreground transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  open ? "translate-y-[4.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-7 bg-foreground transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  open ? "-translate-y-[4.5px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </Container>
      </header>

      {/* Full-screen menu */}
      <div
        id="primary-menu"
        hidden={!open}
        className="fixed inset-0 z-40 bg-background/98 pt-16 backdrop-blur-xl md:pt-20"
      >
        <Container className="menu h-full overflow-y-auto">
          <ul className="menu__links">
            {links.map((link, index) => {
              const current =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={current ? "page" : undefined}
                    className="reveal menu__link"
                    style={{ "--reveal-delay": `${60 * index}ms` } as React.CSSProperties}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* The accounts as bare marks, right under the pages. */}
          <ul className="reveal menu__socials" style={{ "--reveal-delay": "260ms" } as React.CSSProperties}>
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={social.label}
                  className="menu__social"
                >
                  <SocialIcon name={social.icon} className="h-[22px] w-auto" />
                </a>
              </li>
            ))}
          </ul>

          <div className="reveal w-full" style={{ "--reveal-delay": "340ms" } as React.CSSProperties}>
            <MenuMarquee />
          </div>

        </Container>
      </div>
    </>
  );
}
