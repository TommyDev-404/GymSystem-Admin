import { Search, ChevronDown, Filter } from "lucide-react";

interface Props {
  search: string;
  setSearch: (v: string) => void;

  filterCat: string;
  setFilterCat: (v: string) => void;

  filterLevel: string;
  setFilterLevel: (v: string) => void;

  categories: string[];
  levels: readonly string[];
}

export function TutorialFilters({
  search,
  setSearch,
  filterCat,
  setFilterCat,
  filterLevel,
  setFilterLevel,
  categories,
  levels,
}: Props) {
  const usedCategories = [...categories];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
      {/* SEARCH + LEVEL */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* SEARCH */}
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            placeholder="Search by name or muscle group..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* LEVEL FILTER */}
        <div className="relative w-full sm:w-44">
          <select
            className="w-full border border-slate-200 rounded-xl pl-3 pr-8 py-2.5 text-sm text-slate-600 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-400"
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
          >
            <option value="All">All Levels</option>

            {levels.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>

          <ChevronDown
            size={13}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        </div>
      </div>

      {/* CATEGORY CHIPS */}
      <div className="flex flex-wrap gap-2 items-center">
        <Filter size={13} className="text-slate-400" />

        {usedCategories.map((c) => (
          <button
            key={c}
            onClick={() => setFilterCat(c)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              filterCat === c
                ? "bg-emerald-500 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}