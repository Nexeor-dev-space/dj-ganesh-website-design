import Image from "next/image";
import { aboutPortrait, soundStrands } from "@/lib/about";

/**
 * The portrait panel.
 *
 * A 4:5 frame at every width — the source is a tall shot, and this ratio is
 * what keeps the crop above the burnt-in caption at its top edge while still
 * holding his face and the decks. The grade lives entirely in CSS
 * (`.story-photo`); the file on disk is never touched.
 *
 * Hover is deliberately small: a 2% scale, a little more grain and a hairline
 * of accent along the bottom edge. All of it is CSS, so this stays a server
 * component and does nothing at all on touch, where `:hover` never fires.
 */
export function AboutImage() {
  return (
    <figure className="group relative m-0">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface">
        <Image
          src={aboutPortrait.src}
          alt={aboutPortrait.alt}
          fill
          sizes="(min-width: 1024px) 42vw, (min-width: 768px) 50vw, 92vw"
          /* Bottom-anchored: the crop drops the caption burnt into the top of
             the frame and keeps him centred with the decks. */
          className="story-photo object-cover object-[50%_100%]"
        />

        <div className="overlay-vignette pointer-events-none absolute inset-0" />
        <div className="story-grain pointer-events-none absolute inset-0" />

        {/* Hairline that draws itself along the bottom edge on hover. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent/70 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 motion-reduce:transition-none"
        />
      </div>

      {/* Annotation, set vertically down the outside edge — wide screens only,
          where there is gutter to spare and it cannot crowd the heading. */}
      <figcaption
        aria-hidden
        className="absolute -left-md bottom-0 hidden rotate-180 text-[10px] font-light uppercase tracking-[0.32em] text-white/20 [writing-mode:vertical-rl] xl:block"
      >
        {soundStrands.join(" × ")}
      </figcaption>
    </figure>
  );
}
