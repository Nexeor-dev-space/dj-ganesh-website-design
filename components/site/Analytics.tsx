"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState, useSyncExternalStore } from "react";
import { CookieBanner } from "@/components/site/CookieBanner";
import {
  COOKIE_SETTINGS_EVENT,
  ensureGtag,
  gaId,
  readConsent,
  saveConsent,
  subscribeConsent,
  type Consent,
} from "@/lib/analytics";

/**
 * Google Analytics 4, loaded only after the visitor accepts cookies.
 *
 * Until then nothing is requested from Google. Page views are sent from
 * here, one per page: on accepting, on each page load and on every move
 * between pages inside the site. GA4's own automatic page view is switched
 * off (`send_page_view: false`), and the stream's Enhanced measurement →
 * "Page changes based on browser history events" must be off too, or each
 * move would be counted twice.
 *
 * Renders nothing at all until `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set.
 */
export function Analytics() {
  // "server" while rendering on the server and hydrating: the answer lives
  // in the visitor's browser, so nothing is decided until it can be read.
  const consent = useSyncExternalStore<Consent | "unset" | "server">(
    subscribeConsent,
    () => readConsent() ?? "unset",
    () => "server",
  );
  const [askAgain, setAskAgain] = useState(false);
  const pathname = usePathname();

  // One page view per page. Deferred a tick so the new page's title is in
  // place before it is read.
  useEffect(() => {
    if (!gaId || consent !== "granted") return;
    const gtag = initGa();
    const timer = window.setTimeout(() => {
      gtag("event", "page_view", {
        page_location: window.location.href,
        page_title: document.title,
      });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [consent, pathname]);

  useEffect(() => {
    const onSettings = () => setAskAgain(true);
    window.addEventListener(COOKIE_SETTINGS_EVENT, onSettings);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, onSettings);
  }, []);

  const answer = (next: Consent) => {
    saveConsent(next);
    setAskAgain(false);
    if (!window.gtag) return;
    // GA is already loaded from earlier in this visit: switch it with the
    // answer, and clear its cookies on a decline.
    window.gtag("consent", "update", { analytics_storage: next });
    if (next === "denied") clearGaCookies();
  };

  if (!gaId || consent === "server") return null;

  return (
    <>
      {consent === "granted" ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`}
            strategy="afterInteractive"
          />
        </>
      ) : null}

      {consent === "unset" || askAgain ? (
        <CookieBanner onAccept={() => answer("granted")} onDecline={() => answer("denied")} />
      ) : null}
    </>
  );
}

let gaStarted = false;

/**
 * The standard GA4 set-up, once per visit: the gtag queue, consent for
 * statistics only (nothing for advertising), then the property's config with
 * its automatic page view off. Queued before gtag.js arrives, so it always
 * runs ahead of the first page view.
 */
function initGa() {
  const gtag = ensureGtag();
  if (!gaStarted) {
    gaStarted = true;
    gtag("consent", "default", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    gtag("js", new Date());
    gtag("config", gaId, { send_page_view: false });
  }
  return gtag;
}

/** Removes GA's own cookies (`_ga`, `_ga_<id>`) after a change of mind. */
function clearGaCookies() {
  const host = window.location.hostname;
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (!name.startsWith("_ga")) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}
