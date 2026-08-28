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
  { label: "Music", href: "#music" },
  { label: "Shows", href: "#shows" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/djganesh_djg/",
    icon: "instagram",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@DJGANESH_DJG",
    icon: "youtube",
  },
] as const;
