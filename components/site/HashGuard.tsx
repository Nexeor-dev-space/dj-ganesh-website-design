"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Sends an address whose "#…" part names nothing on the page to the 404.
 *
 * The part after "#" never reaches the server, so `/#123` would otherwise
 * just open the homepage. Real section links (`/#music`, `/contact#booking`)
 * match an element id and pass. The check waits for the page to finish
 * rendering, and looks once more a moment later, so a section that mounts
 * late is never mistaken for a missing one.
 */
export function HashGuard() {
  const pathname = usePathname();

  useEffect(() => {
    let timer = 0;

    const missing = () => {
      const raw = window.location.hash.slice(1);
      if (!raw) return false;
      let id = raw;
      try {
        id = decodeURIComponent(raw);
      } catch {}
      return !document.getElementById(id);
    };

    const check = () => {
      window.clearTimeout(timer);
      if (!missing()) return;
      timer = window.setTimeout(() => {
        // Any path no route matches renders the site's 404.
        if (missing()) window.location.replace("/404");
      }, 1200);
    };

    if (document.readyState === "complete") check();
    else window.addEventListener("load", check, { once: true });
    window.addEventListener("hashchange", check);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", check);
      window.removeEventListener("hashchange", check);
    };
  }, [pathname]);

  return null;
}
