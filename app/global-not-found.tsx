import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import { MixWaveform } from "@/components/not-found/MixWaveform";
import { siteConfig } from "@/lib/site";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "404 — Out of the Mix | DJ Ganesh",
  description: "This page dropped out of the mix. Head back to the music.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050505",
  colorScheme: "dark",
};

/**
 * 404 — "Out of the Mix".
 *
 * Served for every URL that matches no route, across both root layouts
 * (Next 16 `global-not-found`, so it brings its own fonts and styles). A dark
 * stage: haze, a spotlight sweeping the back wall, an oversized 404 in the
 * site's heading face with a slow accent sweep, and a waveform that now and
 * then drops out and comes back. Everything is CSS and one small canvas; no
 * sound, and all of it holds still under reduced motion.
 */
export default function GlobalNotFound() {
  return (
    <html lang={siteConfig.locale} className={fontVariables}>
      <body>
        <main className="ootm">
          {/* The stage: haze, a moving spotlight, and the occasional pulse. */}
          <div className="ootm__stage" aria-hidden>
            <span className="ootm__haze" />
            <span className="ootm__spot" />
            <span className="ootm__pulse" />
          </div>

          <header className="ootm__bar">
            <Link href="/" aria-label={`${siteConfig.name} — home`} className="ootm__logo">
              <Image
                src="/images/logo-dj-ganesh.png"
                alt=""
                width={1004}
                height={148}
                unoptimized
                className="h-[26px] w-auto md:h-8"
              />
            </Link>
          </header>

          <div className="ootm__body">
            <p className="ootm__code" aria-hidden data-text="404">
              404
            </p>

            <MixWaveform />

            <h1 className="ootm__title">
              <span className="sr-only">404: </span>Out of the Mix
            </h1>
            <p className="ootm__line">
              Looks like this page dropped out of the mix. Let&rsquo;s get you back to the music.
            </p>

            <div className="ootm__actions">
              <Link href="/" className="btn-primary">
                <span>Take Me Home</span>
                <span aria-hidden className="btn__arrow">
                  &rarr;
                </span>
              </Link>

              <nav aria-label="Elsewhere on the site" className="ootm__links">
                <Link href="/music" className="btn-tertiary">
                  Music
                </Link>
                <Link href="/about" className="btn-tertiary">
                  About
                </Link>
              </nav>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
