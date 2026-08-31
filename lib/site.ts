import type { SiteConfig, SocialLink } from "@/types/site";

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

/**
 * The menu, and every entry is a page that exists.
 *
 * It used to mix section anchors with routes, and three of them — `#shows`,
 * `#gallery`, `#contact` — pointed at ids nothing on the site renders, so
 * those items did nothing at all when clicked. Home-page sections are reached
 * by scrolling or from the footer's own list; this one is the site's routes.
 */
export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Music", href: "/music" },
  { label: "Contact", href: "/contact" },
] as const;

/** Where the navigation's accent button goes. */
export const bookingHref = "/contact";

/**
 * Profiles shown in the navigation rail.
 *
 * The accounts the client actually runs, taken from their own `index.html` —
 * the rail previously linked to instagram.com and youtube.com themselves,
 * which sent visitors to the platforms rather than to the artist. Keep these
 * in step with `footerSocialLinks` in `data/footer.ts`, which lists the same
 * two accounts for the closing credit.
 */
export const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com/djganesh_djg",
    icon: "instagram",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@DJGANESH_DJG",
    icon: "youtube",
  },
] as const satisfies readonly SocialLink[];
