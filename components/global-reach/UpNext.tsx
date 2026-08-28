import { tourShows } from "@/lib/tour";

type UpNextProps = {
  activeCity: string | null;
  onHover: (city: string | null) => void;
  onSelect: (city: string) => void;
};

/**
 * The announced 2026 dates as a compact strip. Each item drives the map:
 * hovering, focusing or tapping one activates its city.
 */
export function UpNext({ activeCity, onHover, onSelect }: UpNextProps) {
  return (
    <div className="flex flex-col gap-md border-t border-border pt-lg md:flex-row md:items-center md:gap-xl">
      <p className="shrink-0 text-[10px] font-light uppercase tracking-[0.32em] text-white/45">
        Up Next
      </p>

      <ul className="flex flex-col gap-xs sm:flex-row sm:flex-wrap sm:gap-md md:gap-lg">
        {tourShows.map((show) => {
          const isActive = activeCity === show.city;

          return (
            <li key={show.city}>
              <button
                type="button"
                aria-pressed={isActive}
                onMouseEnter={() => onHover(show.city)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(show.city)}
                onBlur={() => onHover(null)}
                onClick={() => onSelect(show.city)}
                className={`group flex w-full items-baseline gap-sm border-b py-xs text-left transition-colors duration-300 sm:w-auto ${
                  isActive ? "border-accent" : "border-transparent hover:border-white/20"
                }`}
              >
                <span
                  className={`text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 ${
                    isActive ? "text-accent" : "text-foreground"
                  }`}
                >
                  {show.day} {show.month}
                </span>
                <span className="text-[11px] font-light uppercase tracking-[0.18em] text-white/50">
                  {show.city} · {show.venue}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
