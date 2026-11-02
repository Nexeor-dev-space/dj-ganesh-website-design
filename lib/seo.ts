import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

/**
 * The link-preview image for every page: a stage photo with the logo, set in
 * the site's own black, green and Inter. 1200×630, the size WhatsApp,
 * Facebook, LinkedIn and X all crop from.
 */
export const shareImage = {
  url: "/og/dj-ganesh-share.jpg",
  width: 1200,
  height: 630,
  alt: "DJ Ganesh on stage, arms open to the crowd — Wedding DJ and BollyAfro pioneer",
} as const;

/**
 * A page's complete metadata: title, description, canonical address, and the
 * Open Graph and Twitter cards built from the same three values.
 *
 * Next merges metadata shallowly, so a page that set its own `openGraph`
 * would drop the layout's image and site name. Every page builds the whole
 * set here instead, and the two cards can never disagree with the title.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  /** The page's own path, e.g. "/about". */
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: "en_IN",
      url: path,
      title,
      description,
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: shareImage.url, alt: shareImage.alt }],
    },
  };
}
