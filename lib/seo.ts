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
  image = shareImage,
}: {
  title: string;
  description: string;
  /** The page's own path, e.g. "/about". */
  path: string;
  /** The link-preview image; the site's share image when not given. */
  image?: { url: string; width?: number; height?: number; alt?: string };
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
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: image.url, alt: image.alt }],
    },
  };
}

type SeoFields = {
  title?: string | null;
  description?: string | null;
  image?: number | { url?: string | null; width?: number | null; height?: number | null; alt?: string | null } | null;
} | null | undefined;

const text = (v: string | null | undefined) => (v && v.trim() ? v.trim() : undefined);

/**
 * A page's metadata with its CMS "SEO & Link Previews" fields applied over the
 * built-in title, description and share image. Empty fields keep the
 * built-ins.
 */
export function cmsPageMetadata(
  seo: SeoFields,
  defaults: { title: string; description: string; path: string },
): Metadata {
  const img = seo?.image && typeof seo.image === "object" && seo.image.url ? seo.image : null;
  return pageMetadata({
    title: text(seo?.title) ?? defaults.title,
    description: text(seo?.description) ?? defaults.description,
    path: defaults.path,
    image: img
      ? {
          url: img.url as string,
          width: img.width ?? undefined,
          height: img.height ?? undefined,
          alt: text(img.alt) ?? text(seo?.title) ?? defaults.title,
        }
      : undefined,
  });
}
