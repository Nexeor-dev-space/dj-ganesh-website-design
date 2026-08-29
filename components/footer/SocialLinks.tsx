import { footerSocialLinks } from "@/data/footer";

/**
 * The two accounts the client actually runs, set as text rather than icons —
 * this is a closing credit, not a share bar.
 */
export function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={className}>
      {footerSocialLinks.map((social) => (
        <li key={social.href}>
          <a
            href={social.href}
            target="_blank"
            rel="noreferrer noopener"
            className="social-link group"
          >
            {social.label}
            <span aria-hidden className="social-link__arrow">
              ↗
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
