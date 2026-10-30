import type { Metadata, Viewport } from "next";
import { fontVariables } from "../fonts";
import { CustomCursor } from "@/components/interactions/CustomCursor";
import { HashGuard } from "@/components/site/HashGuard";
import { siteConfig } from "@/lib/site";
import { SiteDataProvider, type SiteData } from "@/components/site/SiteDataProvider";
import { getContactBooking, getHomePage, getNavigation, getSiteSettings } from "@/lib/cms/queries";
import "../globals.css";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
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
        .map((st) => ({ name: st.name, ...(st.featured ? { featured: true } : {}) })),
      trusted: (home?.trustedBy?.names ?? []).map((n) => n.name).filter((n): n is string => Boolean(n)),
    },
    nav: navigation
      ? {
          items: (navigation.items ?? []).map((i) => ({
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
            title: c.title,
            links: c.links?.map((l) => ({
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
      </body>
    </html>
  );
}
