import type { CSSProperties } from "react";
import { useSiteData } from "@/components/site/SiteDataProvider";
import { stageRows as codeStageRows } from "@/lib/stages";
import { trustedNames as codeTrustedNames } from "@/data/trusted";
import type { Stage } from "@/types/stages";
import { itemKey } from "@/lib/keys";

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

/**
 * The names for each row: one stage row, then a third of the trusted names.
 * Follows the CMS lists (Home Page → Stages and Trusted By) when they hold
 * anything, and the built-in lists otherwise.
 */
function buildRows(stages: readonly (readonly Stage[])[], trusted: readonly string[]) {
  return stages.map((row, index) => {
    const share = Math.ceil(trusted.length / stages.length);
    const names = trusted.slice(index * share, (index + 1) * share);
    return [
      ...row.map((stage) => ({ name: stage.name, featured: stage.featured })),
      ...names.map((name) => ({ name, featured: true })),
    ];
  });
}

/** Deals a flat CMS list into three rows, as the Stages section does. */
function threeRows(flat: readonly Stage[]): Stage[][] {
  const size = Math.ceil(flat.length / 3);
  return [0, 1, 2].map((i) => flat.slice(i * size, (i + 1) * size)).filter((r) => r.length);
}

const durations = [38, 46, 42] as const;

export function MenuMarquee() {
  const { menuNames } = useSiteData();
  const cmsStages = menuNames?.stages ?? [];
  const rows = buildRows(
    cmsStages.length ? threeRows(cmsStages) : codeStageRows,
    menuNames?.trusted?.length ? menuNames.trusted : codeTrustedNames,
  );

  return (
    <div className="menu-marquee" aria-label={trustedLabel}>
      <p className="menu-marquee__label">{trustedLabel}</p>

      <div className="menu-marquee__rows">
        {rows.map((row, rowIndex) => {
          const group = (
            <ul className="menu-row__group">
              {row.map((item, i) => {
                return (
                  <li
                    key={itemKey(item, i)}
                    className="menu-row__item"
                    data-featured={item.featured ? "true" : undefined}
                  >
                    {item.name}
                    <span className="menu-row__mark" aria-hidden>
                      ✦
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
