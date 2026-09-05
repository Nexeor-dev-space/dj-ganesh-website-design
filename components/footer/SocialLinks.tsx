import { SocialIcon } from "@/components/navigation/SocialIcon";
import { footerSocialLinks } from "@/data/footer";

/**
 * The rail of round buttons under the columns.
 *
 * The glyphs are the navigation's own, so the two accounts are drawn the same
 * way at the top of the page and at the bottom of it. Each button is 44px, and
 * carries its name for anyone who cannot see the glyph.
 */
export function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={`footer-socials ${className ?? ""}`.trim()}>
      {footerSocialLinks.map((social) => (
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
