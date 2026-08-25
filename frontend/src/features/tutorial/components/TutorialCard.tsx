import { Dumbbell, Tag, Edit2, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Workout } from "../types/TutorialType";
import { getYoutubeVideoId, ytThumb } from "@/utils/ytParser";
import { catColors, levelColors } from "../constants/TutorialConstants";

interface Props {
  workout: Workout;
  onEdit: () => void;
  onDelete: () => void;
}

export function TutorialCard({ workout, onEdit, onDelete }: Props) {
  const videoId = getYoutubeVideoId(workout.video_url);
  const thumb = ytThumb(videoId!);

  return (
    <Card className="group overflow-hidden rounded-2xl border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-stone-700 dark:bg-stone-900">
      <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-stone-800">
        {thumb ? (
          <img
            src={thumb}
            alt={workout.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Dumbbell
              size={36}
              className="text-slate-300 dark:text-slate-600"
            />
          </div>
        )}

        <div className="absolute left-3 top-3">
          <span
            className={`rounded-lg border bg-white/90 px-2.5 py-1 text-xs font-medium backdrop-blur-sm dark:bg-stone-900/90 ${levelColors[workout.level]}`}
          >
            {workout.level}
          </span>
        </div>

        <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            size="icon"
            variant="secondary"
            onClick={onEdit}
            className="h-8 w-8 rounded-lg"
          >
            <Edit2 size={14} />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            onClick={onDelete}
            className="h-8 w-8 rounded-lg hover:text-red-500"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold leading-snug text-slate-800 dark:text-slate-100">
            {workout.name}
          </h3>
          <span
            className={`shrink-0 rounded-lg px-2 py-0.5 text-xs font-medium ${
              catColors[workout.category] ?? "bg-slate-100 text-slate-600"
            }`}
          >
            {workout.category}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Dumbbell size={12} />
          <span>{workout.equipment.join(", ")}</span>
        </div>

        {workout.muscles_targeted.length > 0 && (
          <div className="flex items-start gap-2">
            <Tag size={12} className="mt-0.5 text-slate-400" />
            <div className="flex flex-wrap gap-1">
              {workout.muscles_targeted.slice(0, 4).map((muscle) => (
                <span
                  key={muscle}
                  className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-stone-800 dark:text-slate-300"
                >
                  {muscle}
                </span>
              ))}

              {workout.muscles_targeted.length > 4 && (
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-stone-800 dark:text-slate-300">
                  +{workout.muscles_targeted.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-stone-800">
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {workout.created_at &&
              new Date(workout.created_at).toLocaleDateString()}
          </span>

          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={onEdit}
              className="h-8 w-8"
            >
              <Edit2 size={14} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={onDelete}
              className="h-8 w-8 hover:text-red-500"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}