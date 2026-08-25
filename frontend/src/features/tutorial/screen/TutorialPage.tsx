import { useMemo, useState } from "react";
import { TutorialFilters } from "@/features/tutorial/components/TutorialFilter";

import { TutorialModal } from "@/features/tutorial/components/TutorialModal";
import { TutorialCard } from "@/features/tutorial/components/TutorialCard";
import type { Workout, WorkoutResponse } from "../types/TutorialType";
import { useGetAllTutorials, useRemoveTutorial } from "../hook/useTutorial";
import { toast } from "sonner";
import { NoTutorialFound } from "../components/NoTutorialFound";
import { debounce } from "@/lib/debounce";
import { Loader } from "@/components/shared/Loader";
import { Plus } from "lucide-react";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import PageHeader from "@/components/shared/PageHeader";

const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
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

export function TutorialsPage() {
  const { mutate: deleteTutorial, isPending } = useRemoveTutorial();
  
	const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [filterLevel, setFilterLevel] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Workout | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Workout | null>(null);

  const debounceSearch = useMemo(
      () =>
        debounce((value: string) => {
          setSearch(value);
        }),
      []
  );
  
  const params = useMemo(() => ({
    search: search || undefined,
    level: filterLevel !== "All" ? filterLevel : undefined,
    category: filterCat !== "All" ? filterCat : undefined,
  }), [search, filterLevel, filterCat]);

  const { data: tutorialsData = [], isLoading } = useGetAllTutorials(params);
  
  const tutorials = tutorialsData?.map((tutorial: WorkoutResponse) => ({
    ...tutorial,
    equipment: JSON.parse(tutorial.equipment),
    muscles_targeted: JSON.parse(tutorial.muscles_targeted),
    demo_images: JSON.parse(tutorial.demo_images),
  })) ?? [];

  const handleDelete = (id: number) => {
    deleteTutorial(id, {
      onSuccess: () => {
        toast.success("Tutorial remove successfully!");
        setDeleteTarget(null);
      },
    });
  };

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <PageHeader
        title="Tutorials"
        subtitle="Manage members workout tutorials"
        icon={Plus}
        actionName="Create Reward"
        setOpen={() => {
          setEditTarget(null);
          setModalOpen(true);
        }}
      />

      {/* FILTERS */}
      <TutorialFilters
        search={searchInput}
				setSearch={(value) => {
					setSearchInput(value);
					debounceSearch(value);
				}}
        filterCat={filterCat}
        setFilterCat={setFilterCat}
        filterLevel={filterLevel}
        setFilterLevel={setFilterLevel}
        categories={CATEGORIES}
        levels={LEVELS}
      />

      {/* GRID */}
      {isLoading ? (
        <Loader/>
      ) : tutorials.length > 0 ?
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {tutorials.map((w: Workout) => (
            <TutorialCard
              key={w.id}
              workout={w}
              onEdit={() => {
                setEditTarget(w);
                setModalOpen(true);
              }}
              onDelete={() => setDeleteTarget(w)}
            />
          ))}
        </div>
      :
        <NoTutorialFound/>
      }

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

      <ConfirmationDialog
        open={!!deleteTarget}
        name={deleteTarget?.name}
        onClose={() => setDeleteTarget(null)}
        type="Tutorial"
        isPending={isPending}
        onConfirm={() => handleDelete(deleteTarget!.id)}
      />
    </div>
  );
}