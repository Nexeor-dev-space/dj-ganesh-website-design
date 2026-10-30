/**
 * The privacy policy: short by design, covering only what this site actually
 * does. The booking form is the only thing that collects personal data, and
 * the site runs no analytics, advertising or tracking cookies.
 *
 * These are the defaults; the CMS "Privacy Policy" global overrides any of
 * them, and seeds from them.
 */
export const privacyPolicy = {
  title: "Privacy Policy",
  updated: "30 October 2026",
  intro:
    "This page explains what we collect when you contact DJ Ganesh (Ganesh Ranganathan) through this website, and what we do with it.",
  sections: [
    {
      heading: "What we collect",
      body: "Only what you send through the booking form: your name, email, and any phone number, organisation, event details, budget and message you choose to add. We don't use advertising or tracking cookies.",
    },
    {
      heading: "Why",
      body: "To reply to your enquiry and plan your booking. We never sell your details or add you to a mailing list.",
    },
    {
      heading: "Who sees it",
      body: "DJ Ganesh's team and, where a booking needs it, our booking partners (Black Hat Talent or VStar Entertainment). The service that hosts this website stores it securely.",
    },
    {
      heading: "How long we keep it",
      body: "Up to two years from your enquiry, then it is deleted.",
    },
    {
      heading: "Your rights",
      body: "You can ask to see, correct or delete your details, or withdraw your consent, at any time.",
    },
    {
      heading: "Contact",
      body: "Email info@djganeshbombay.com with any privacy question or request.",
    },
  ],
} as const;
