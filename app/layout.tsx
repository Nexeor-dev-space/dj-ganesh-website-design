import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { PlumeRegion } from "@/components/effects/PlumeRegion";
import { SoundToggle } from "@/components/audio/SoundToggle";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Section headings — a single client-supplied weight, so no bold/italic
// variants are declared.
const consul = localFont({
  src: "../public/fonts/Consul.ttf",
  display: "swap",
  weight: "400",
  style: "normal",
  variable: "--font-consul",
});

// The name itself: the banner lockup and the footer signature. Also one
// weight only.
const laura = localFont({
  src: "../public/fonts/LAURA.otf",
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={siteConfig.locale}
      className={`${inter.variable} ${consul.variable} ${laura.variable}`}
    >
      <body>
        {/* One hidden frame behind every route: nothing shows it until the
            pointer's flame passes over it. It lives here rather than on the
            home page so the effect is the site's, not one page's — the banner
            and the footer keep their own regions, which take precedence
            because `ColourPlume` resolves to the closest one. */}
        <PlumeRegion src="/images/s-4.jpg">{children}</PlumeRegion>

        {/* Fixed under the navigation on every page. Only the wrapper is
            fixed; the button keeps the site's own gutter. Reserved for now —
            see `SoundToggle` for why it isn't wired to anything. */}
        <div className="sound-dock">
          <div className="container-page flex justify-end">
            <SoundToggle className="pointer-events-auto reveal [--reveal-delay:1100ms]" />
          </div>
        </div>
      </body>
    </html>
  );
}
