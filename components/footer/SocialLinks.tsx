"use client";

import { SocialIcon } from "@/components/navigation/SocialIcon";
import { footerContactEmail, footerSocialLinks } from "@/data/footer";
import { hasText, mapSocials, useSiteData } from "@/components/site/SiteDataProvider";
import type { FooterSocialLink } from "@/types/footer";

/**
 * The rail of round buttons under the columns.
 *
 * The glyphs are the navigation's own, so the two accounts are drawn the same
 * way at the top of the page and at the bottom of it. Each button is 44px, and
 * carries its name for anyone who cannot see the glyph.
 */
export function SocialLinks({ className }: { className?: string }) {
  const { socials: cmsSocials, footer } = useSiteData();
  const mapped = mapSocials(cmsSocials);
  const email = hasText(footer?.contactEmail)
    ? footer.contactEmail
    : footerContactEmail;
  // CMS accounts (external), then the booking address, as in the static rail.
  const socials: readonly FooterSocialLink[] = mapped
    ? [
        ...mapped.map((s) => ({ ...s, external: true })),
        { label: "Email", href: `mailto:${email}`, icon: "email" as const },
      ]
    : footerSocialLinks.map((s) =>
        s.icon === "email" && hasText(footer?.contactEmail)
          ? { ...s, href: `mailto:${email}` }
          : s,
      );

  return (
    <ul className={`footer-socials ${className ?? ""}`.trim()}>
      {socials.map((social) => (
        <li key={social.href}>
          <a
            href={social.href}
            {...(social.external
              ? { target: "_blank", rel: "noreferrer noopener" }
              : {})}
            aria-label={social.label}
            className="footer-social"
          >
            <SocialIcon name={social.icon} className="h-[17px] w-auto" />
          </a>
        </li>
      ))}
    </ul>
  );
}
