import type { Metadata, Viewport } from "next";
import { fontVariables } from "../fonts";
import { CustomCursor } from "@/components/interactions/CustomCursor";
import { HashGuard } from "@/components/site/HashGuard";
import { Analytics } from "@/components/site/Analytics";
import { siteConfig, siteUrl } from "@/lib/site";
import { shareImage } from "@/lib/seo";
import { SiteDataProvider, type SiteData } from "@/components/site/SiteDataProvider";
import { getContactBooking, getHomePage, getNavigation, getSiteSettings } from "@/lib/cms/queries";
import "../globals.css";

/**
 * Site-wide defaults. `metadataBase` turns every relative URL below (and in
 * each page's own metadata) into a full address on the live domain. Each
 * public page sets its own canonical address and cards via `pageMetadata`.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteConfig.title,
  description: siteConfig.description,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_IN",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [{ url: shareImage.url, alt: shareImage.alt }],
  },
  // Google Search Console ownership: the code from "HTML tag" verification.
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050505",
  colorScheme: "dark",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [settings, navigation, contact, home] = await Promise.all([
    getSiteSettings(),
    getNavigation(),
    getContactBooking(),
    getHomePage(),
  ]);

  // Plain, serializable subsets only — no functions or class instances cross
  // the server/client boundary.
  const siteData: SiteData = {
    menuNames: {
      stages: (home?.stages?.stages ?? [])
        .filter((st) => st.name)
        .map((st) => ({ id: st.id, name: st.name, ...(st.featured ? { featured: true } : {}) })),
      trusted: (home?.trustedBy?.names ?? []).map((n) => n.name).filter((n): n is string => Boolean(n)),
    },
    brand: settings
      ? {
          name: settings.siteName ?? null,
          logo:
            settings.logo && typeof settings.logo === "object" && settings.logo.url
              ? {
                  url: settings.logo.url,
                  alt: settings.logo.alt ?? null,
                  width: settings.logo.width ?? null,
                  height: settings.logo.height ?? null,
                }
              : null,
        }
      : null,
    nav: navigation
      ? {
          menuMarqueeLabel: navigation.menuMarqueeLabel ?? null,
          items: (navigation.items ?? []).map((i) => ({
            id: i.id,
            label: i.label,
            url: i.url,
            isExternal: i.isExternal ?? null,
            order: i.order ?? null,
            visible: i.visible ?? null,
          })),
        }
      : null,
    socials: (settings?.socialLinks?.length
      ? settings.socialLinks
      : contact?.socialLinks
    )?.map((s) => ({ platform: s.platform, url: s.url })),
    footer: settings?.footer
      ? {
          columns: settings.footer.columns?.map((c) => ({
            id: c.id,
            title: c.title,
            links: c.links?.map((l) => ({
              id: l.id,
              label: l.label,
              href: l.href,
              external: l.external ?? null,
            })),
          })),
          statement: settings.footer.statement ?? null,
          copyright: settings.footer.copyright ?? null,
          contactEmail: settings.footer.contactEmail ?? null,
        }
      : null,
    contact: contact
      ? {
          bookingCtaText: contact.bookingCtaText ?? null,
          bookingCtaUrl: contact.bookingCtaUrl ?? null,
          whatsappNumber: contact.whatsapp?.whatsappNumber ?? null,
          whatsappLabel: contact.whatsapp?.whatsappLabel ?? null,
          whatsappMessage: contact.whatsapp?.whatsappMessage ?? null,
        }
      : null,
  };

  return (
    <html
      lang={siteConfig.locale}
      className={fontVariables}
    >
      <body>
        <SiteDataProvider value={siteData}>{children}</SiteDataProvider>

        {/* The site's own cursor — a ring and a dot, on every route. Wide
            precise-pointer screens only; it renders nothing anywhere else. */}
        <CustomCursor />

        {/* An unknown "#…" on any page goes to the 404, like a wrong path. */}
        <HashGuard />

        {/* Google Analytics behind a cookie banner; off until its ID is set. */}
        <Analytics />
      </body>
    </html>
  );
}
