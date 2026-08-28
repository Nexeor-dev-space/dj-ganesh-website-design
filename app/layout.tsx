import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Display face for headings — a strong, tight modern grotesk.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "700"],
  variable: "--font-space-grotesk",
});

// The hero lockup's face — a single client-supplied weight, so no bold/italic
// variants are declared.
const consul = localFont({
  src: "../public/fonts/Consul.ttf",
  display: "swap",
  weight: "400",
  style: "normal",
  variable: "--font-consul",
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
      className={`${inter.variable} ${spaceGrotesk.variable} ${consul.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
