"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/layout/Container";
import { SocialIcon } from "@/components/navigation/SocialIcon";
import { navLinks, siteConfig, socialLinks } from "@/lib/site";

/**
 * Fixed navigation bar: outlined wordmark on the left, social rail, a single
 * accent call-to-action and a hamburger that opens the full-screen menu.
 * Links live in the overlay so the bar itself stays quiet at every width.
 */
export function Navbar() {
  const [open, setOpen] = useState(false);

  // Freeze the page behind the overlay and let Escape close it.
  useEffect(() => {
    if (!open) return;

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
          <a
            href="#hero"
            aria-label={`${siteConfig.name} — home`}
            className="group inline-flex items-center px-4 py-2 transition-opacity duration-200 hover:opacity-80 md:px-6 md:py-2.5"
          >
            <span className="font-display text-[13px] font-bold uppercase leading-none tracking-[0.28em] md:text-[15px]">
              DJ<span className="text-accent">&nbsp;Ganesh</span>
            </span>
          </a>

          <div className="flex items-center gap-sm">
            <ul className="hidden items-center gap-xs sm:flex">
              {socialLinks.map((social) => (
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

            <a
              href="#contact"
              className="inline-flex h-10 items-center gap-xs rounded-full bg-accent px-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-background transition-opacity duration-200 hover:opacity-85 md:h-11 md:px-6"
            >
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
              Book
            </a>

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
        <Container className="flex h-full flex-col justify-between py-2xl">
          <ul className="flex flex-col gap-md">
            {navLinks.map((link, index) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="reveal font-display text-[36px] font-bold uppercase leading-[1.05] tracking-[-0.03em] transition-colors duration-200 hover:text-accent md:text-[64px]"
                  style={{ "--reveal-delay": `${60 * index}ms` } as React.CSSProperties}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <ul className="flex items-center gap-sm">
            {socialLinks.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={social.label}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-border text-white/70 transition-colors duration-200 hover:border-accent hover:text-accent"
                >
                  <SocialIcon name={social.icon} className="h-[22px] w-auto" />
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </>
  );
}
