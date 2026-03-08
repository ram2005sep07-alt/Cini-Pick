import { useState, useMemo } from "react";
import { Genre } from "@/lib/tmdb";
import { Search } from "lucide-react";

interface FilterBarProps {
  genres: Genre[];
  onSearch: (genreId: number, year?: number) => void;
  isLoading: boolean;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 60 }, (_, i) => currentYear - i);

const FilterBar = ({ genres, onSearch, isLoading }: FilterBarProps) => {
  const [selectedGenre, setSelectedGenre] = useState<number>(0);
  const [selectedYear, setSelectedYear] = useState<number | undefined>();

  const sortedGenres = useMemo(
    () => [...genres].sort((a, b) => a.name.localeCompare(b.name)),
    [genres]
  );

  const handleSubmit = () => {
    if (selectedGenre) {
      onSearch(selectedGenre, selectedYear);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-3">
      <select
        value={selectedGenre}
        onChange={(e) => setSelectedGenre(Number(e.target.value))}
        className="h-11 w-full rounded-lg border border-border bg-secondary px-4 text-sm text-foreground outline-none transition-colors focus:border-primary sm:w-52"
      >
        <option value={0}>Select Genre *</option>
        {sortedGenres.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>

      <select
        value={selectedYear ?? ""}
        onChange={(e) =>
          setSelectedYear(e.target.value ? Number(e.target.value) : undefined)
        }
        className="h-11 w-full rounded-lg border border-border bg-secondary px-4 text-sm text-foreground outline-none transition-colors focus:border-primary sm:w-44"
      >
        <option value="">Any Year</option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      <button
        onClick={handleSubmit}
        disabled={!selectedGenre || isLoading}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 font-display text-sm tracking-wider text-primary-foreground transition-all hover:opacity-90 disabled:opacity-40 sm:w-auto"
      >
        <Search className="h-4 w-4" />
        {isLoading ? "LOADING..." : "RECOMMEND"}
      </button>
    </div>
  );
};

export default FilterBar;
