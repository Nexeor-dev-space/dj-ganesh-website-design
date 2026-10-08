"use client";

import { createContext, useContext, type ReactNode } from "react";

/**
 * Site-wide CMS data for the chrome (nav, footer, WhatsApp button).
 *
 * Fetched once in the server layout and handed down as plain JSON. Every field
 * is optional: consumers use a CMS value only when it is present and otherwise
 * keep their own hardcoded constants, so an empty CMS renders today's site.
 */
export type SiteData = {
  nav?: {
    items?: {
      label?: string | null;
      url?: string | null;
      isExternal?: boolean | null;
      order?: number | null;
      visible?: boolean | null;
    }[] | null;
  } | null;
  socials?: { platform?: string | null; url?: string | null }[] | null;
  footer?: {
    columns?: {
      title?: string | null;
      links?: { label?: string | null; href?: string | null; external?: boolean | null }[] | null;
    }[] | null;
    statement?: string | null;
    copyright?: string | null;
    contactEmail?: string | null;
  } | null;
  contact?: {
    bookingCtaUrl?: string | null;
    whatsappNumber?: string | null;
    whatsappLabel?: string | null;
    whatsappMessage?: string | null;
  } | null;
};

const SiteDataContext = createContext<SiteData>({});

export function SiteDataProvider({
  value,
  children,
}: {
  value: SiteData;
  children: ReactNode;
}) {
  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export function useSiteData(): SiteData {
  return useContext(SiteDataContext);
}

const has = (v: string | null | undefined): v is string =>
  typeof v === "string" && v.trim() !== "";

/** Visible items, sorted by `order`, as `{label, href}`; null if none usable. */
export function mapNavLinks(nav: SiteData["nav"]) {
  const items = (nav?.items ?? [])
    .filter((i) => i.visible !== false && has(i.label) && has(i.url))
    .map((i, idx) => ({ i, idx }))
    .sort((a, b) => (a.i.order ?? 0) - (b.i.order ?? 0) || a.idx - b.idx)
    .map(({ i }) => ({ label: i.label as string, href: i.url as string }));
  return items.length ? items : null;
}

/** Only platforms SocialIcon can draw (instagram / youtube); null if none. */
/** The platforms the site has a mark for; the rest are skipped. */
const labels = { instagram: "Instagram", youtube: "YouTube", spotify: "Spotify" } as const;

export function mapSocials(socials: SiteData["socials"]) {
  const out = (socials ?? [])
    .filter((s) => s.platform != null && s.platform in labels && has(s.url))
    .map((s) => {
      const icon = s.platform as keyof typeof labels;
      return { label: labels[icon], href: s.url as string, icon } as const;
    });
  return out.length ? out : null;
}

export { has as hasText };
