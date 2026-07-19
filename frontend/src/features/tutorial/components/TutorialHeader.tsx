import { Plus } from "lucide-react";

interface Props {
  total: number;
  shown: number;
  onAdd: () => void;
}

export function TutorialHeader({
  total,
  shown,
  onAdd,
}: Props) {
  return (
   <div className="flex items-start justify-between gap-4">
      <div>
         <h1 className="text-slate-800 font-semibold">Workout Tutorials</h1>
         <p className="text-slate-500 text-sm mt-0.5">
            Manage members workout tutorials
         </p>
         </div>
         <button
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-200 shrink-0"
         >
            <Plus size={15} />
            Add Tutorial
         </button>
   </div>
  );
}