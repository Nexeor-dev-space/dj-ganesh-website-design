import { tourCities } from "@/lib/tour";

type CityListProps = {
  activeCity: string | null;
  onHover: (city: string | null) => void;
  onSelect: (city: string) => void;
};

/**
 * The full footprint as an editorial run of city names — not navigation.
 * Each name is a button so the map is reachable by keyboard and by touch.
 */
export function CityList({ activeCity, onHover, onSelect }: CityListProps) {
  return (
    <ul className="flex flex-wrap items-baseline gap-x-lg gap-y-sm md:gap-x-2xl">
      {tourCities.map((city) => {
        const isActive = activeCity === city.name;

        return (
          <li key={city.name}>
            <button
              type="button"
              aria-pressed={isActive}
              onMouseEnter={() => onHover(city.name)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(city.name)}
              onBlur={() => onHover(null)}
              onClick={() => onSelect(city.name)}
              className={`font-display text-[20px] font-bold uppercase leading-tight tracking-[-0.02em] transition-colors duration-300 hover:text-accent md:text-[28px] ${
                isActive ? "text-accent" : "text-white/35"
              }`}
            >
              {city.name}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
