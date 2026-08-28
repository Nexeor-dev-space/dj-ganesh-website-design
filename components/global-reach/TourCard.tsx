import { bookingEmail, findShow } from "@/lib/tour";
import type { GlobeAnchor } from "@/components/global-reach/TourGlobe";

type TourCardProps = {
  city: string;
  anchor: GlobeAnchor | null;
};

/**
 * The floating information card for the active city.
 *
 * Cities with an announced 2026 date get the date, venue and a ticket link;
 * every other city falls back to the enquiry route, exactly as the original
 * site behaved. Below `md` the card sits in flow under the globe instead of
 * floating, so it can never leave the viewport on a phone.
 */
export function TourCard({ city, anchor }: TourCardProps) {
  const show = findShow(city);
  const side = anchor?.side ?? "right";

  return (
    <div
      className="tour-card mt-md w-full md:mt-0 md:w-[224px]"
      data-anchored={anchor ? "true" : "false"}
      style={
        anchor
          ? ({
              "--card-x": `${anchor.x}px`,
              "--card-y": `${anchor.y}px`,
              "--card-shift": side === "right" ? "0%" : "-100%",
            } as React.CSSProperties)
          : undefined
      }
    >
      <div className="border border-accent/35 bg-background/92 p-md backdrop-blur-sm">
        <p className="text-[9px] font-light uppercase tracking-[0.28em] text-accent">
          {show ? "Next show · 2026" : "Open date"}
        </p>

        <p className="mt-sm font-display text-[20px] font-bold uppercase leading-none tracking-[-0.02em]">
          {city}
        </p>

        {show ? (
          <>
            <p className="mt-xs text-[11px] font-light uppercase tracking-[0.18em] text-white/60">
              {show.day} {show.month} 2026
            </p>
            <p className="mt-xs text-[12px] text-muted-foreground">{show.venue}</p>
            <a
              href={show.ticketsUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="group mt-md inline-flex items-center gap-xs text-[10px] font-semibold uppercase tracking-[0.22em] text-accent"
            >
              Get Tickets
              <span
                aria-hidden
                className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </a>
          </>
        ) : (
          <>
            <p className="mt-xs text-[11px] font-light uppercase tracking-[0.18em] text-white/60">
              No show announced
            </p>
            <p className="mt-xs text-[12px] text-muted-foreground">
              Bring DJ Ganesh to your city
            </p>
            <a
              href={`mailto:${bookingEmail}`}
              className="group mt-md inline-flex items-center gap-xs text-[10px] font-semibold uppercase tracking-[0.22em] text-accent"
            >
              Enquire to Book
              <span
                aria-hidden
                className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </a>
          </>
        )}
      </div>
    </div>
  );
}
