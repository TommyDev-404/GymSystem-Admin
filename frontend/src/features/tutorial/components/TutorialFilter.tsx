import { Search, Filter } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  return (
    <Card className="
      rounded-2xl
      border
      border-stone-200
      dark:border-stone-700
      shadow-sm
    ">
      <div className="
        flex
        flex-wrap
        items-center
        gap-4
        px-4
        py-1
      ">

        {/* Search */}
        <div className="relative flex-1 min-w-[260px]">
          <Search
            size={18}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-slate-400
              dark:text-slate-500
            "
          />

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or muscle group..."
            className="
              h-11
              rounded-xl
              pl-10
              bg-slate-50
              dark:bg-stone-900
              border-stone-200
              dark:border-stone-700
              text-slate-700
              dark:text-slate-200
              placeholder:text-slate-400
              dark:placeholder:text-slate-500
              shadow-none
              focus-visible:ring-2
              focus-visible:ring-emerald-500
              focus-visible:border-emerald-500
            "
          />
        </div>

        <Separator
          orientation="vertical"
          className="
            hidden
            h-12
            lg:block
            dark:bg-stone-700
          "
        />

        <div className="
          hidden
          md:flex
          items-center
          gap-2
          text-slate-500
          dark:text-slate-400
        ">
          <Filter size={17} />

          <span className="text-sm font-medium">
            Filters
          </span>
        </div>

        {/* Level */}
        <Select
          value={filterLevel}
          onValueChange={setFilterLevel}
        >
          <SelectTrigger className="
            h-11
            w-[180px]
            border-slate-200
            dark:border-stone-700
            text-slate-700
            dark:text-slate-200
          ">
            <SelectValue placeholder="Level" />
          </SelectTrigger>

          <SelectContent className="
            border-slate-200
            dark:border-stone-700
          ">
            <SelectItem value="All">
              All Levels
            </SelectItem>

            {levels.map((level) => (
              <SelectItem
                key={level}
                value={level}
              >
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Categories */}
      <div className="
        flex
        flex-wrap
        items-center
        gap-2
        px-4
        pb-4
      ">
        <Filter
          size={15}
          className="
            text-slate-400
            dark:text-slate-500
          "
        />

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilterCat(category)}
            className={`
              px-3
              py-1.5
              rounded-lg
              text-xs
              font-medium
              transition-colors

              ${
                filterCat === category
                  ? "bg-emerald-500 text-white"
                  : `
                    bg-slate-100
                    dark:bg-stone-800
                    text-slate-600
                    dark:text-slate-300
                    hover:bg-slate-200
                    dark:hover:bg-stone-700
                  `
              }
            `}
          >
            {category}
          </button>
        ))}
      </div>
    </Card>
  );
}