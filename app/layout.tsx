import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
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
      <body>{children}</body>
    </html>
  );
}
