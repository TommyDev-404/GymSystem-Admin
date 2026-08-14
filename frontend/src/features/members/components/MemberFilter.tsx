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
  gender: string;
  setGender: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
}

export function MemberFilters({
  search,
  setSearch,
  gender,
  setGender,
  status,
  setStatus,
}: Props) {
  return (
    <Card className="
      rounded-2xl
      border
      border-stone-200
      dark:border-stone-700
      shadow-sm
    ">
      <div className="flex flex-wrap items-center gap-4 px-4 py-1">

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
            placeholder="Search members..."
            className="
              rounded-xl
              bg-slate-50
              h-11
              pl-10
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


        {/* Divider */}
        <Separator
          orientation="vertical"
          className="
            hidden 
            h-12 
            lg:block
            dark:bg-stone-700
          "
        />


        {/* Filters Label */}
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


        {/* Gender */}
        <Select
          value={gender}
          onValueChange={setGender}
        >
          <SelectTrigger className="
            h-11 
            w-[180px]
            border-slate-200
            dark:border-stone-700
            text-slate-700
            dark:text-slate-200
          ">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>

          <SelectContent className="
            border-slate-200
            dark:border-stone-700
          ">
            <SelectItem value="All">
              All Genders
            </SelectItem>

            <SelectItem value="Male">
              Male
            </SelectItem>

            <SelectItem value="Female">
              Female
            </SelectItem>
          </SelectContent>
        </Select>


        {/* Status */}
        <Select
          value={status}
          onValueChange={setStatus}
        >
          <SelectTrigger className="
            h-11
            w-[180px]
            border-slate-200
            dark:border-stone-700
            text-slate-700
            dark:text-slate-200
          ">
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent className="
            border-slate-200
            dark:border-stone-700
          ">
            <SelectItem value="All">
              All Status
            </SelectItem>

            <SelectItem value="Active">
              Active
            </SelectItem>

            <SelectItem value="Expired">
              Expired
            </SelectItem>
          </SelectContent>
        </Select>

      </div>
    </Card>
  );
}