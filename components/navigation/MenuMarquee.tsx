import type { CSSProperties } from "react";
import { SocialIcon } from "@/components/navigation/SocialIcon";
import { stageRows } from "@/lib/stages";
import { trustedNames } from "@/data/trusted";
import { socialLinks } from "@/lib/site";

/**
 * The trust marquee inside the menu.
 *
 * Three rows: the rooms from `lib/stages.ts` and the names from
 * `data/trusted.ts`, dealt out so each row carries some of both, with the
 * accounts' marks set between the names in place of a bullet. Each row runs
 * at its own pace and the middle one the other way, so the three never read
 * as one sheet sliding past. Nothing here is new copy — every name already
 * appears on the home page.
 *
 * Each row is printed twice and slides exactly half its width, so the loop is
 * seamless; only the first copy is in the accessibility tree.
 */
const trustedLabel = "Trusted by, and the rooms he plays";

/** The names for each row: one stage row, then a third of the trusted names. */
const rows = stageRows.map((stages, index) => {
  const share = Math.ceil(trustedNames.length / stageRows.length);
  const names = trustedNames.slice(index * share, (index + 1) * share);
  return [
    ...stages.map((stage) => ({ name: stage.name, featured: stage.featured })),
    ...names.map((name) => ({ name, featured: true })),
  ];
});

const durations = [38, 46, 42] as const;

export function MenuMarquee() {
  return (
    <div className="menu-marquee" aria-label={trustedLabel}>
      <p className="menu-marquee__label">{trustedLabel}</p>

      <div className="menu-marquee__rows">
        {rows.map((row, rowIndex) => {
          const group = (
            <ul className="menu-row__group">
              {row.map((item, itemIndex) => {
                const social =
                  socialLinks[(rowIndex + itemIndex) % socialLinks.length];

                return (
                  <li
                    key={item.name}
                    className="menu-row__item"
                    data-featured={item.featured ? "true" : undefined}
                  >
                    {item.name}
                    <span className="menu-row__mark" aria-hidden>
                      <SocialIcon
                        name={social.icon}
                        className="h-full w-auto"
                      />
                    </span>
                  </li>
                );
              })}
            </ul>
          );

          return (
            <div
              key={rowIndex}
              className="menu-row"
              style={
                {
                  "--marquee-duration": `${durations[rowIndex % durations.length]}s`,
                  "--marquee-direction": rowIndex === 1 ? "reverse" : "normal",
                } as CSSProperties
              }
            >
              {group}
              <div aria-hidden className="menu-row__group">
                {group}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
