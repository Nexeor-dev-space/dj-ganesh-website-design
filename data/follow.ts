import type { SocialLink } from "@/types/site";

/**
 * The Follow band — his accounts, and the one address that books him.
 *
 * No longer rendered: the band was folded into the booking panel and the
 * menu. Kept because `scripts/seed.ts` still seeds the CMS's `follow` group
 * from it, and that group remains in the schema.
 *
 * Every link and every caption here is carried over verbatim from the
 * client's own `socials` section; nothing is invented, and no account exists
 * here that does not exist there.
 */
export type FollowLink = SocialLink & {
  /** The caption under the mark. Set uppercase by the stylesheet. */
  caption: string;
  /** Leaves the site, so it opens in its own tab. */
  external?: boolean;
};

export const followHeading = "Follow";

export const followLinks = [
  {
    label: "Instagram",
    caption: "246K · Instagram",
    href: "https://instagram.com/djganesh_djg",
    icon: "instagram",
    external: true,
  },
  {
    label: "YouTube",
    caption: "YouTube",
    href: "https://www.youtube.com/@DJGANESH_DJG",
    icon: "youtube",
    external: true,
  },
  {
    label: "Booking",
    caption: "Booking",
    href: "mailto:info@djganeshbombay.com",
    icon: "email",
  },
] satisfies readonly FollowLink[];
