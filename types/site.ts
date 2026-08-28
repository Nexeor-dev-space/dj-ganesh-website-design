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

export type SocialIconName = "instagram" | "youtube";

export type SocialLink = {
  label: string;
  href: string;
  icon: SocialIconName;
};
