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
              current_weight: true
           }
        }
     }
  });

  if (!member) {
    throw new Error("Member not found.");
  }

  return {
    member: {
      name: member.fullname,
      goal: member.fitness_goals[0].goal_type,
      weight: Number(member.fitness_goals[0].current_weight)
    },
  };
}