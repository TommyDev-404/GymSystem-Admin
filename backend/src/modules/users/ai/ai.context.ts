import { prisma } from "../../../lib/prisma";
import { CoachContext } from "./ai.types";

export async function buildCoachContext(
  memberId: number,
): Promise<CoachContext> {
  const member = await prisma.members.findUnique({
    where: {
      id: memberId,
    },
    select: {
      fullname: true,
      fitness_goals: {
        select: {
          goal_type: true,
          current_weight: true,
        },
      },
    },
  });

  if (!member) {
    throw new Error("Member not found.");
  }

  const goal = member.fitness_goals[0];

  return {
    member: {
      name: member.fullname,
      goal: goal?.goal_type ?? "No goal set for this user.",
      weight: goal?.current_weight
        ? Number(goal.current_weight)
        : 0,
    },
  };
}