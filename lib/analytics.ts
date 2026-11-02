/**
 * Visitor statistics, through Google Analytics 4, behind a cookie choice.
 *
 * Off unless `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set (the GA4 "Measurement
 * ID", G-XXXXXXXXXX). It is read at build time, so it must be set when the
 * site is built. Nothing is loaded from Google, and no cookie is set, until
 * a visitor presses Accept in the cookie banner.
 */
export const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "";

/** Where the visitor's answer is kept, on their own device. */
const CONSENT_KEY = "dj-cookie-consent";

export type Consent = "granted" | "denied";

/** Fired when the visitor answers, so the loader can react in the same tab. */
export const CONSENT_EVENT = "dj:cookie-consent";
/** Fired by the footer's "Cookie settings" link to show the banner again. */
export const COOKIE_SETTINGS_EVENT = "dj:cookie-settings";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Kept for the visit too, in case the browser blocks storage. */
let sessionConsent: Consent | null = null;

export function readConsent(): Consent | null {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    if (value === "granted" || value === "denied") return value;
  } catch {
    // Storage blocked: fall back to this visit's answer.
  }
  return sessionConsent;
}

export function saveConsent(consent: Consent) {
  sessionConsent = consent;
  try {
    window.localStorage.setItem(CONSENT_KEY, consent);
  } catch {
    // Storage blocked: the choice still applies for this visit.
  }
  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_EVENT, { detail: consent }));
}

/** For `useSyncExternalStore`: re-read the answer when it changes, in this
 *  tab or another. */
export function subscribeConsent(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT));
}

/** The standard gtag queue: calls made before gtag.js arrives are replayed. */
export function ensureGtag() {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag() {
      // gtag.js reads the `arguments` object itself, not an array copy.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
  }
  return window.gtag;
}

/**
 * Sends a GA4 event. Does nothing when analytics is off or the visitor has
 * not accepted cookies.
 */
export function trackEvent(event: string, params?: Record<string, string | number>) {
  if (!gaId || typeof window === "undefined" || readConsent() !== "granted") return;
  ensureGtag()("event", event, params ?? {});
}
