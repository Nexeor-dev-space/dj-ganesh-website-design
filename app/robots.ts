import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * /robots.txt — the public site is open to crawlers; the CMS admin, the API
 * and the /dev sandbox are not.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/dev"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
