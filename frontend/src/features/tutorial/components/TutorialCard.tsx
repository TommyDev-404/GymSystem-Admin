import { Dumbbell, Play, Tag, Edit2, Trash2 } from "lucide-react";
import type { Workout } from "../types/TutorialType";


const levelColors: Record<string, string> = {
  Beginner: "text-green-600",
  Intermediate: "text-yellow-600",
  Advanced: "text-red-600",
};

const catColors: Record<string, string> = {
  "Muscle Gain": "bg-blue-100 text-blue-700",
  "Weight Loss": "bg-green-100 text-green-700",
  "Strength": "bg-red-100 text-red-700",
  "Endurance": "bg-purple-100 text-purple-700",
  "Fat Loss": "bg-orange-100 text-orange-700",
  "Flexibility": "bg-pink-100 text-pink-700",
  "General Fitness": "bg-slate-100 text-slate-700",
};

function getYoutubeVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url);

    // youtube.com/watch?v=VIDEO_ID
    if (urlObj.hostname.includes("youtube.com")) {
      return urlObj.searchParams.get("v");
    }

    // youtu.be/VIDEO_ID
    if (urlObj.hostname.includes("youtu.be")) {
      return urlObj.pathname.slice(1);
    }

    return null;
  } catch {
    return null;
  }
}

function ytThumb(videoId: string) {
  if (!videoId) return "";
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}


interface Props {
  workout: Workout;
  onEdit: () => void;
  onDelete: () => void;
}

export function TutorialCard({ workout, onEdit, onDelete }: Props) {
  const videoId = getYoutubeVideoId(workout.video_url);
  const thumb = ytThumb(videoId!);
  
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
      {/* THUMBNAIL */}
      <div className="relative h-44 bg-slate-100 overflow-hidden">
        {thumb ? (
          <img
            src={thumb}
            alt={workout.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Dumbbell size={36} className="text-slate-300" />
          </div>
        )}

        {/* PLAY OVERLAY */}
        {workout.video_url && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <Play size={18} className="text-emerald-600 ml-0.5" />
            </div>
          </div>
        )}

        {/* LEVEL BADGE */}
        <div className="absolute top-2.5 left-2.5">
          <span
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border bg-white/90 backdrop-blur-sm ${
              levelColors[workout.level]
            }`}
          >
            {workout.level}
          </span>
        </div>

        {/* ACTIONS */}
        <div className="absolute top-2.5 right-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg bg-white shadow-md text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <Edit2 size={13} />
          </button>

          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg bg-white shadow-md text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="p-4 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-slate-800 font-semibold text-sm leading-snug">
            {workout.name}
          </h3>

          <span
            className={`shrink-0 px-2 py-0.5 rounded-lg text-xs font-medium ${
              catColors[workout.category] ??
              "bg-slate-100 text-slate-600"
            }`}
          >
            {workout.category}
          </span>
        </div>

        {/* EQUIPMENT */}
        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
          <Dumbbell size={11} className="text-slate-400" />
          {workout.equipment.map((e, index) => (
              <span key={index}>{index < workout.equipment.length - 1 ? `${e},` : `${e}`}</span>
          ))}
        </div>

        {/* MUSCLES */}
        {workout.muscles_targeted.length > 0 && (
          <div className="flex items-start gap-1.5">
            <Tag size={11} className="text-slate-400 mt-0.5" />

            <div className="flex flex-wrap gap-1">
              {workout.muscles_targeted.slice(0, 4).map((m) => (
                <span
                  key={m}
                  className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-md"
                >
                  {m}
                </span>
              ))}

              {workout.muscles_targeted.length > 4 && (
                <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-md">
                  +{workout.muscles_targeted.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-50">
          <span className="text-slate-400 text-xs">
            {workout.created_at && new Date(workout.created_at).toLocaleDateString()}
          </span>

          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors"
            >
              <Edit2 size={13} />
            </button>

            <button
              onClick={onDelete}
              className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}