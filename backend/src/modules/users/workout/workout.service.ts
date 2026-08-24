import { prisma } from "../../../lib/prisma";
import { CreateWorkoutInput } from "./workout.types";


export const getWorkoutTutorialsService = async (
	query: {
		limit?: string;
		category?: string;
	}
) => {
	const categoryFilter = query.category && query.category !== "All"
		? query.category
		: undefined;

	return await prisma.tutorials.findMany({
		where: {
			...(categoryFilter && {
				category: categoryFilter,
			}),
		},

		...(query.limit && {
			take: Number(query.limit),
		}),
	});
};

export const getWorkoutTutorialByIdService = async (workoutId: number) => {
	return await prisma.tutorials.findUnique({
		where: {
			id: Number(workoutId),
		},
	});
};

export const getPersonalWorkoutHistoryService = async (member_id: number) => {
	const workouts = await prisma.member_workouts.findMany({
		where: {
		member_id: Number(member_id),
		},

		include: {
		member_workout_exercises: true,
		},

		orderBy: {
		completed_at: "desc",
		},
	});

	return workouts.map((workout) => ({
		id: workout.id,
		name: workout.workout_name,
		date: workout.completed_at?.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		}),
		duration: `${workout.duration_minutes} min`,
		exercises: workout.member_workout_exercises.map(
			(exercise) => ({
				id: exercise.id,
				name: exercise.exercise_name,
				sets: `${exercise.sets} sets`,
				reps: `${exercise.reps} reps`,
				weight: `${exercise.weight} kg`,
			})
		),
	}));
};

export const getWorkoutSummaryService = async (
	member_id: number
 ) => {
	const memberId = Number(member_id);
 
	// Get all completed workouts
	const workouts = await prisma.member_workouts.findMany({
	  where: {
		 member_id: memberId,
		 completed_at: {
			not: null,
		 },
	  },
	  select: {
		 completed_at: true,
		 duration_minutes: true,
	  },
	  orderBy: {
		 completed_at: "desc",
	  },
	});
 
	// ==============================
	// TOTAL WORKOUTS
	// ==============================
 
	const totalWorkouts = workouts.length;
 
	// ==============================
	// THIS WEEK
	// ==============================
 
	const now = new Date();
 
	const day = now.getDay();
 
	// Monday = 1
	// Sunday = 0
	const diff = day === 0 ? -6 : 1 - day;
 
	const startOfWeek = new Date(now);
 
	startOfWeek.setDate(
	  now.getDate() + diff
	);
 
	startOfWeek.setHours(
	  0,
	  0,
	  0,
	  0
	);
 
	const weeklyWorkouts = workouts.filter(
	  (workout) => {
		 if (!workout.completed_at) {
			return false;
		 }
 
		 const completedAt =
			new Date(workout.completed_at);
 
		 return completedAt >= startOfWeek;
	  }
	).length;
 
	// ==============================
	// AVERAGE DURATION
	// ==============================
 
	const durations = workouts
	  .map((workout) =>
		 Number(workout.duration_minutes ?? 0)
	  )
	  .filter((duration) => duration > 0);
 
	const averageDuration =
	  durations.length > 0
		 ? Math.round(
			  durations.reduce(
				 (sum, duration) =>
					sum + duration,
				 0
			  ) / durations.length
			)
		 : 0;
 
	// ==============================
	// RESPONSE
	// ==============================
 
	return {
	  totalWorkouts,
	  weeklyWorkouts,
	  averageDuration,
	};
 };

export const getWorkoutProgressService = async (
	member_id: number
 ) => {
	const today = new Date();
 
	// Monday of the current week
	const day = today.getDay();
 
	const diff = day === 0 ? -6 : 1 - day;
 
	const monday = new Date(today);
 
	monday.setDate(
	  today.getDate() + diff
	);
 
	monday.setHours(0, 0, 0, 0);
 
	// Sunday at the end of the week
	const sunday = new Date(monday);
 
	sunday.setDate(
	  monday.getDate() + 7
	);
 
	/*
	 * Get workouts for this week
	 */
	const workouts =
	  await prisma.member_workouts.findMany({
		 where: {
			member_id: Number(member_id),
 
			completed_at: {
			  gte: monday,
			  lt: sunday,
			},
		 },
 
		 select: {
			completed_at: true,
		 },
 
		 orderBy: {
			completed_at: "asc",
		 },
	  });
 
	/*
	 * Create every day of this week
	 */
	const days = new Map<string, number>();
 
	for (let i = 0; i < 7; i++) {
	  const date = new Date(monday);
 
	  date.setDate(
		 monday.getDate() + i
	  );
 
	  const key =
		 date.toISOString().split("T")[0];
 
	  days.set(key, 0);
	}
 
	/*
	 * Count workouts per day
	 */
	workouts.forEach((workout) => {
	  if (!workout.completed_at) return;
 
	  const date = new Date(
		 workout.completed_at
	  );
 
	  const key =
		 date.toISOString().split("T")[0];
 
	  if (days.has(key)) {
		 days.set(
			key,
			(days.get(key) ?? 0) + 1
		 );
	  }
	});
 
	return Array.from(
	  days.entries()
	).map(([date, count]) => ({
	  value: count,
 
	  label: new Date(
		 `${date}T00:00:00`
	  ).toLocaleDateString(
		 "en-US",
		 {
			weekday: "short",
		 }
	  ),
	}));
};
 
export const createPersonalWorkoutService = async (data: CreateWorkoutInput) => {
	const {
		member_id,
		name,
		duration,
		exercises = [],
	} = data;

	await prisma.$transaction(async (tx) => {
		const createdWorkout = await tx.member_workouts.create({
			data: {
				member_id: Number(member_id),
				workout_name: name.trim(),
				duration_minutes: Number(duration),
			},
		});

		// Exercises are optional
		if (exercises.length > 0) {
			await tx.member_workout_exercises.createMany({
				data: exercises.map((exercise) => ({
					workout_id: createdWorkout.id,
					exercise_name: exercise.name.trim(),
					sets: Number(exercise.sets),
					reps: Number(exercise.reps),
					weight: Number(exercise.weight),
				})),
			});
		}
	});

	return {
		success: true,
		message: "Workout added successfully.",
	};
};

export const searchExercisesService = async (search?: string) => {
	const keyword = search?.trim();
 
	if (!keyword) {
	  return [];
	}
 
	return await prisma.tutorials.findMany({
		where: {
			name: {
				contains: keyword,
			},
		},

		select: {
			id: true,
			name: true,
		},

		take: 10,

		orderBy: {
			name: "asc",
		},
	});
};