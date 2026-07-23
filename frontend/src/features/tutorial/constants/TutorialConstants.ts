
export const levelColors: Record<string, string> = {
  Beginner: "text-green-600",
  Intermediate: "text-yellow-600",
  Advanced: "text-red-600",
};

export const catColors: Record<string, string> = {
  "Muscle Gain": "bg-blue-100 text-blue-700",
  "Weight Loss": "bg-green-100 text-green-700",
  "Strength": "bg-red-100 text-red-700",
  "Endurance": "bg-purple-100 text-purple-700",
  "Fat Loss": "bg-orange-100 text-orange-700",
  "Flexibility": "bg-pink-100 text-pink-700",
  "General Fitness": "bg-slate-100 text-slate-700",
};

export const CATEGORIES = [
   "Muscle Gain",
   "Weight Loss",
   "Strength",
   "Endurance",
   "Fat Loss",
   "Flexibility",
   "General Fitness",
];

export const LEVELS=[
   "Beginner",
   "Intermediate",
   "Advanced",
] as const;

export const MUSCLES_TARGETED=[
   "Chest",
   "Back",
   "Biceps",
   "Triceps",
   "Legs",
   "Shoulders",
];

export const EQUIPMENT_OPTIONS=[
   "Dumbbell",
   "Barbell",
   "Machine",
   "Bodyweight",
   "Cable",
];
