import type { ReactNode } from "react";
import { ColourPlume } from "@/components/effects/ColourPlume";

type PlumeRegionProps = {
  /** The frame every section in the region reveals. */
  src: string;
  children: ReactNode;
};

/**
 * One hidden frame shared by every section it wraps.
 *
 * The hero keeps its own photograph — it is the identity of the first
 * viewport, and it is meant to be seen. Everything below it instead sits on a
 * single frame nobody sees until the pointer's flame passes over it, rather
 * than each section carrying a background of its own.
 *
 * The layer is one viewport tall and sticks to the top while the region
 * scrolls past, so there is a single canvas the size of the screen no matter
 * how long the page grows. It is the region's first child and every section
 * paints over it, so sections stay in charge of what covers the frame — see
 * `.plume-region` in `globals.css`, which clears their opaque backgrounds.
 *
 * `data-plume-region` is what `ColourPlume` reads to decide where the pointer
 * has to be for the plume to burn: anywhere in the region, and nowhere above
 * it, which is what keeps the hero's own plume separate.
 */
export function PlumeRegion({ src, children }: PlumeRegionProps) {
  return (
    <div data-plume-region className="plume-region">
      <div className="plume-region__layer" aria-hidden>
        <div className="plume-region__frame">
          <ColourPlume
            src={src}
            className="absolute inset-0"
            imageClassName="object-cover object-center opacity-0"
            /* The source is 5000×5000. Nothing here is ever seen sharp — the
               plume samples it through soft brushes — so cap the request well
               below the 3840px `100vw` would otherwise ask Next to encode. */
            sizes="(min-width: 768px) 1600px, 100vw"
          />
        </div>
      </div>

      {children}
    </div>
  );
}
