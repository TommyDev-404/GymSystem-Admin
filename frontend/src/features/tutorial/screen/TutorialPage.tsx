import { useMemo, useState } from "react";
import { TutorialHeader } from "@/features/tutorial/components/TutorialHeader";
import { TutorialFilters } from "@/features/tutorial/components/TutorialFilter";
import { DeleteTutorialDialog } from "@/features/tutorial/components/DeleteTutorialDialog";

import { TutorialModal } from "@/features/tutorial/components/TutorialModal";
import { TutorialCard } from "@/features/tutorial/components/TutorialCard";
import type { Workout, WorkoutResponse } from "../types/TutorialType";
import { useGetAllTutorials, useRemoveTutorial } from "../hook/useTutorial";
import { toast } from "sonner";
import { NoTutorialFound } from "../components/NoTutorialFound";

const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

export function TutorialsPage() {
  const { mutate: deleteTutorial, isPending } = useRemoveTutorial();

  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [filterLevel, setFilterLevel] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Workout | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Workout | null>(null);

  const params = useMemo(() => ({
    search: search || undefined,
    level: filterLevel !== "All" ? filterLevel : undefined,
  }), [search, filterLevel]);

  const { data: tutorialsData = [], isLoading } = useGetAllTutorials(params);
  
  const tutorials = tutorialsData?.map((tutorial: WorkoutResponse) => ({
    ...tutorial,
    equipment: JSON.parse(tutorial.equipment),
    muscles_targeted: JSON.parse(tutorial.muscles_targeted),
    demo_images: JSON.parse(tutorial.demo_images),
  })) ?? [];

  const filtered = tutorials.filter((w: Workout) => {
    const matchSearch =
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.muscles_targeted.some((m) =>
        m.toLowerCase().includes(search.toLowerCase())
      );

    const matchCat =
      filterCat === "All" || w.category === filterCat;

    const matchLevel =
      filterLevel === "All" || w.level === filterLevel;

    return matchSearch && matchCat && matchLevel;
  });

  const handleDelete = (id: number) => {
    deleteTutorial(id, {
      onSuccess: () => {
        toast.success("Tutorial remove successfully!");
        setDeleteTarget(null);
      },
    });
  };

  const CATEGORIES = [
    "All",
    "Muscle Gain",
    "Weight Loss",
    "Strength",
    "Endurance",
    "Fat Loss",
    "Flexibility",
    "General Fitness",
   ];

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <TutorialHeader
        total={filtered.length}
        shown={filtered.length}
        onAdd={() => {
          setEditTarget(null);
          setModalOpen(true);
        }}
      />

      {/* FILTERS */}
      <TutorialFilters
        search={search}
        setSearch={setSearch}
        filterCat={filterCat}
        setFilterCat={setFilterCat}
        filterLevel={filterLevel}
        setFilterLevel={setFilterLevel}
        categories={CATEGORIES}
        levels={LEVELS}
      />

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.length > 0 ?
          filtered.map((w: Workout) => (
            <TutorialCard
              key={w.id}
              workout={w}
              onEdit={() => {
                setEditTarget(w);
                setModalOpen(true);
              }}
              onDelete={() => setDeleteTarget(w)}
            />
          ))
        :
          <NoTutorialFound/>
        }
      </div>

      {/* MODAL */}
      {modalOpen && (
        <TutorialModal
          open={modalOpen}
          initial={editTarget}
          onClose={() => {
            setModalOpen(false);
            setEditTarget(null);
          }}
        />
      )}

      {/* DELETE DIALOG */}
      <DeleteTutorialDialog
        open={!!deleteTarget}
        name={deleteTarget?.name}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget!.id)}
      />
    </div>
  );
}