import React, { useMemo } from "react";
import "./css/FiltersSidebar.css";

export type SortOption =
  | "relevance"
  | "price_low_high"
  | "price_high_low"
  | "rating_high_low"
  | "date_new_old";

export interface FiltersState {
  search: string;
  genres: Set<string>;
  minPrice: string; 
  maxPrice: string;
  inStockOnly: boolean;
  minRating: number;
  newArrivalsOnly: boolean;
  sortBy: SortOption;
}

interface Props {
  genres: string[];
  value: FiltersState;
  onChange: (next: FiltersState) => void;
}

export default function FiltersSidebar({ genres, value, onChange }: Props) {
  const normalizedGenres = useMemo(
    () => genres.map((g) => g.trim()).filter(Boolean),
    [genres]
  );

  const toggleGenre = (g: string) => {
    const next = new Set(value.genres);
    const key = g.toLowerCase();
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onChange({ ...value, genres: next });
  };

  return (
    <div className="filters_customers">
      <div className="block">
        <input
          className="search"
          type="text"
          placeholder="Search title, author, genre…"
          value={value.search}
          onChange={(e) => onChange({ ...value, search: e.target.value })}
        />
      </div>

      <div className="block">
        <div className="block-title">Genres</div>
        <div className="chips vertical">
          {normalizedGenres.length === 0 && <div className="muted">No genres</div>}
          {normalizedGenres.map((g) => {
            const active = value.genres.has(g.toLowerCase());
            return (
              <button
                key={g}
                className={`chip vertical-chip ${active ? "active" : ""}`}
                onClick={() => toggleGenre(g)}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      <div className="block two-col">
        <div>
          <label className="label" htmlFor="minPrice">Min Price</label>
          <input
            id="minPrice"
            type="number"
            min={0}
            value={value.minPrice}
            onChange={(e) => onChange({ ...value, minPrice: e.target.value })}
            placeholder="Enter min price"
          />
        </div>
        <div>
          <label className="label" htmlFor="maxPrice">Max Price</label>
          <input
            id="maxPrice"
            type="number"
            min={0}
            value={value.maxPrice}
            onChange={(e) => onChange({ ...value, maxPrice: e.target.value })}
            placeholder="Enter max price"
          />
        </div>
      </div>

      <div className="block">
        <div className="label">Minimum Rating</div>
        <div className="stars">
          {[ 1, 2, 3, 4, 5].map((r) => (
            <button
              key={r}
              className={`star ${value.minRating === r ? "active" : ""}`}
              onClick={() =>
                onChange({
                  ...value,
                  minRating: value.minRating === r ? 0 : r,
                })
              }
            >
              {r}★
            </button>

          ))}
        </div>
      </div>

      <div className="block checks">
        <label className="check">
          <input
            type="checkbox"
            checked={value.inStockOnly}
            onChange={(e) => onChange({ ...value, inStockOnly: e.target.checked })}
          />
          In stock only
        </label>

        <label className="check">
          <input
            type="checkbox"
            checked={value.newArrivalsOnly}
            onChange={(e) =>
              onChange({ ...value, newArrivalsOnly: e.target.checked })
            }
          />
          New arrivals (last 30 days)
        </label>
      </div>
    </div>
  );
}
