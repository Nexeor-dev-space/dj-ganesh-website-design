import { DM_Serif_Display, Inter } from "next/font/google";
import localFont from "next/font/local";

/**
 * The site's fonts, shared by the root layout and the global 404 (which
 * renders outside that layout and so has to load them itself).
 */
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// The quote face on the wall of love. The client's own site sets its
// testimonials in DM Serif Display, and the italic is the whole character of
// that block — nothing already loaded here has a serif to stand in for it.
export const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
});

// Section headings — a single client-supplied weight, so no bold/italic
// variants are declared.
export const consul = localFont({
  src: "../public/fonts/Consul.ttf",
  display: "swap",
  weight: "400",
  style: "normal",
  variable: "--font-consul",
});

// The name itself: the banner lockup and the footer signature. Also one
// weight only.
export const laura = localFont({
  src: "../public/fonts/LAURA.otf",
  display: "swap",
  weight: "400",
  style: "normal",
  variable: "--font-laura",
});

/** Every font's CSS variable, for the `<html>` element. */
export const fontVariables = `${inter.variable} ${consul.variable} ${laura.variable} ${dmSerif.variable}`;
