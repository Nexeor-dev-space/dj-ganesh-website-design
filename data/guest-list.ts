/**
 * The private-clientele showcase: the business families and the celebrity
 * weddings, as supplied by the client. These are the built-in defaults; the
 * CMS group overrides them once it is wired.
 *
 * `primary` is the line set large; `secondary` is the quieter line (the family
 * or the company).
 */
export type GuestEntry = {
  id: string;
  primary: string;
  secondary: string;
};

export type GuestCategory = {
  id: string;
  label: string;
  /** One word for the filter pill on phones, where the full label wraps. */
  shortLabel?: string;
  entries: readonly GuestEntry[];
  closing?: string;
};

export const privateCelebrations: GuestCategory = {
  id: "private",
  label: "Private Celebrations",
  shortLabel: "Private",
  entries: [
    { id: "ambani", primary: "Anant Ambani & Radhika Merchant", secondary: "Ambani Family" },
    { id: "adani", primary: "Jeet Adani & Diva Shah", secondary: "Adani Family" },
    { id: "mantena", primary: "Netra Mantena & Raju Mantena", secondary: "Mantena Family" },
    { id: "singhania", primary: "Gautam Singhania", secondary: "Singhania Family · Raymond Group" },
    { id: "meswani", primary: "Hital Meswani", secondary: "Meswani Family · Reliance Industries" },
    {
      id: "ypo-eo",
      primary: "YPO & EO",
      secondary: "International Leadership Retreats & Private Celebrations · 10+ Years",
    },
  ],
  closing: "And many more distinguished business families and influential personalities.",
};

export const celebrityWeddings: GuestCategory = {
  id: "weddings",
  label: "Celebrity Weddings",
  shortLabel: "Weddings",
  entries: [
    { id: "rashmika-vijay", primary: "Rashmika Mandanna & Vijay Deverakonda", secondary: "Wedding" },
    { id: "sid-kiara", primary: "Sidharth Malhotra & Kiara Advani", secondary: "Wedding" },
    { id: "rakul-jackky", primary: "Rakul Preet Singh & Jackky Bhagnani", secondary: "Wedding" },
    { id: "richa-ali", primary: "Richa Chadha & Ali Fazal", secondary: "Wedding" },
    { id: "kajal-gautam", primary: "Kajal Aggarwal & Gautam Kitchlu", secondary: "Wedding" },
    { id: "kunal-arpita", primary: "Kunal Rawal & Arpita Mehta", secondary: "Wedding" },
    { id: "hardik-natasa", primary: "Hardik Pandya & Natasa Stankovic", secondary: "Wedding" },
    { id: "poorna-namit", primary: "Poorna Patel & Namit Soni", secondary: "Wedding" },
    { id: "sonakshi-zaheer", primary: "Sonakshi Sinha & Zaheer Iqbal", secondary: "Wedding" },
    { id: "randeep-lin", primary: "Randeep Hooda & Lin Laishram", secondary: "Wedding" },
  ],
};

export const guestListCategories = [privateCelebrations, celebrityWeddings] as const;

export const guestListLabel = "Private Clientele";
export const guestListHeading = ["The Guest", "List"] as const;
export const guestListLede =
  "Trusted behind closed doors — by India's most distinguished families and the names on every front page.";

/** The counting strip. Numbers count up from zero on first view. */
export const guestListStats = [
  { id: "families", value: 5, suffix: "", label: "Billionaire families" },
  { id: "weddings", value: 10, suffix: "", label: "Celebrity weddings" },
  { id: "ypo", value: 10, suffix: "+", label: "Years with YPO & EO" },
] as const;

export const guestListCta = { label: "Plan a private celebration", href: "/contact#booking" } as const;
