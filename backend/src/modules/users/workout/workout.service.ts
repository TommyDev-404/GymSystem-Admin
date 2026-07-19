import { prisma } from "../../../lib/prisma";
import { CreateWorkoutInput } from "./workout.types";

export const getWorkoutTutorialsService = async (
  query: {
    limit?: string;
    category?: string;
  }
) => {
  const categoryFilter =
    query.category && query.category !== "All"
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
	  date: workout.completed_at!.toLocaleDateString(
		 "en-US",
		 {
			month: "short",
			day: "numeric",
			year: "numeric",
		 }
	  ),
	  duration: `${workout.duration_minutes} min`,
	  calories: workout.calories_burned,
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

export const createPersonalWorkoutService = async (data: CreateWorkoutInput) => {
	const {
		member_id,
		name,
		duration,
		calories,
		exercises,
	} = data;

	const workout = await prisma.$transaction(async (tx) => {
		// Create workout
		const createdWorkout = await tx.member_workouts.create({
			data: {
				member_id: Number(member_id),
				workout_name: name,
				duration_minutes: Number(duration),
				calories_burned: Number(calories),
			},
		});

		if (!createdWorkout) throw new Error();

		// Create exercises
		await tx.member_workout_exercises.createMany({
			data: exercises.map((exercise) => ({
				workout_id: createdWorkout.id,
				exercise_name: exercise.name,
				sets: Number(exercise.sets),
				reps: Number(exercise.reps),
				weight: Number(exercise.weight),
			})),
		});
		
		return true;
	});

	return {
		success: true,
		message: "Workout added successfully."
	};
};