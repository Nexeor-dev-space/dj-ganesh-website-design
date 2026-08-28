import type { SiteConfig } from "@/types/site";

/**
 * Single source of truth for site-wide copy, navigation and links.
 * Update here rather than in individual pages or components.
 */
export const siteConfig: SiteConfig = {
  name: "DJ Ganesh",
  title: "DJ Ganesh | Official Website",
  description:
    "Official website of DJ Ganesh — DJ, performer and BollyAfro artist.",
  locale: "en",
};

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Music", href: "#music" },
  { label: "Shows", href: "#shows" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
] as const;
