/** Shape of the shared site configuration in `lib/site.ts`. */
export type SiteConfig = {
  name: string;
  title: string;
  description: string;
  locale: string;
};

export type NavLink = {
  label: string;
  href: string;
};

export type SocialLink = {
  /** Accessible name, e.g. "Instagram". */
  label: string;
  href: string;
  /** Key into the icon map in `components/navigation/SocialIcon.tsx`. */
  icon: "instagram" | "youtube";
};
