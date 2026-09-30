import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import localFont from "next/font/local";
import { CustomCursor } from "@/components/interactions/CustomCursor";
import { siteConfig } from "@/lib/site";
import { SiteDataProvider, type SiteData } from "@/components/site/SiteDataProvider";
import { getContactBooking, getNavigation, getSiteSettings } from "@/lib/cms/queries";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// The quote face on the wall of love. The client's own site sets its
// testimonials in DM Serif Display, and the italic is the whole character of
// that block — nothing already loaded here has a serif to stand in for it.
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
});

// Section headings — a single client-supplied weight, so no bold/italic
// variants are declared.
const consul = localFont({
  src: "../../public/fonts/Consul.ttf",
  display: "swap",
  weight: "400",
  style: "normal",
  variable: "--font-consul",
});

// The name itself: the banner lockup and the footer signature. Also one
// weight only.
const laura = localFont({
  src: "../../public/fonts/LAURA.otf",
  display: "swap",
  weight: "400",
  style: "normal",
  variable: "--font-laura",
});

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
  const [settings, navigation, contact] = await Promise.all([
    getSiteSettings(),
    getNavigation(),
    getContactBooking(),
  ]);

  // Plain, serializable subsets only — no functions or class instances cross
  // the server/client boundary.
  const siteData: SiteData = {
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
      className={`${inter.variable} ${consul.variable} ${laura.variable} ${dmSerif.variable}`}
    >
      <body>
        <SiteDataProvider value={siteData}>{children}</SiteDataProvider>

        {/* The site's own cursor — a ring and a dot, on every route. Wide
            precise-pointer screens only; it renders nothing anywhere else. */}
        <CustomCursor />
      </body>
    </html>
  );
}
