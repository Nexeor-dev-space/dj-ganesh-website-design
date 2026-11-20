"use client";

import Link from "next/link";

/**
 * The cookie question, as a small bar at the foot of the screen. Accept and
 * Decline carry the same weight; nothing is loaded from Google until Accept.
 * Shown again from the footer's "Cookie settings" link.
 */
export function CookieBanner({
  onAccept,
  onDecline,
}: {
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <section className="cookie-banner" aria-label="Cookie preferences">
      <p className="cookie-banner__text">
        We use Google Analytics cookies to see which pages are visited, so we can improve the
        site. No advertising.{" "}
        <Link href="/privacy" className="cookie-banner__link">
          Privacy Policy
        </Link>
      </p>

      <div className="cookie-banner__actions">
        <button type="button" onClick={onDecline} className="btn-secondary btn--sm">
          <span>Decline</span>
        </button>
        <button type="button" onClick={onAccept} className="btn-primary btn--sm">
          <span>Accept</span>
        </button>
      </div>
    </section>
  );
}
