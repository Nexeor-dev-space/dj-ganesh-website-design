import type { SocialLink } from "@/types/site";

/** One round button on the footer's social rail. */
export type FooterSocialLink = {
  /** Accessible name, e.g. "Instagram". */
  label: string;
  href: string;
  icon: SocialLink["icon"];
  /** Opens in a new tab. Absent for `mailto:`. */
  external?: boolean;
};
