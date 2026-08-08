import { prisma } from "../../../lib/prisma";
import { CreateGoalDTO, UpdateGoalDTO } from "./home.types";

function calculateStreak(dates: Date[]) {
   if (dates.length === 0) return 0;

   let streak = 1;

   const uniqueDates = dates.map((date) =>
      new Date(
         date.getFullYear(),
         date.getMonth(),
         date.getDate()
      ).getTime()
   );

   for (let i = 0; i < uniqueDates.length - 1; i++) {
      const current = uniqueDates[i];
      const previous = uniqueDates[i + 1];


      const difference =
         (current - previous) /
         (1000 * 60 * 60 * 24);


      if (difference === 1) {
         streak++;
      } else {
         break;
      }
   }

   return streak;
}

export const getMemberDashboardDataService = async (member_id: number) => {
   const now = new Date();
 
   const startOfMonth = new Date(
     now.getFullYear(),
     now.getMonth(),
     1
   );
 
   const member = await prisma.members.findUnique({
     where: {
       id: member_id,
     },
     select: {
       id: true,
       users: {
         select: {
           username: true
         }
       },
         email: true,
         membership_plans: {
            select: {
               plan_name: true
            }
         },
        member_memberships: {
            select: {
                start_date: true,
                end_date: true,
            }
        },
         is_activated: true,
         points: true,
     },
   });
 
   if (!member) {
     throw new Error("Member not found");
   }
 
   const totalVisits = await prisma.attendance.count({
     where: {
       member_id: member.id,
     },
   });
 
   const thisMonth = await prisma.attendance.count({
     where: {
       member_id,
       check_in_time: {
         gte: startOfMonth,
       },
     },
   });
 
   const attendance = await prisma.attendance.findMany({
     where: {
       member_id,
     },
     orderBy: {
       check_in_time: "desc",
     },
     select: {
       check_in_time: true,
     },
   });
 
   const dayStreak = calculateStreak(
     attendance.map((item) => item.check_in_time)
   );
 
   return {
      id: member.id,
      username: member.users?.username,
      membership_start: member.member_memberships[0]
         ? new Date(member.member_memberships[0].start_date).toLocaleDateString("en-PH", {
               timeZone: "Asia/Manila",
               month: "short",
               day: "2-digit",
               year: "numeric",
            })
         : null,
      plan: member.membership_plans.plan_name,
      expiry: member.member_memberships[0]
         ? new Date(member.member_memberships[0].end_date)
            .toLocaleDateString("en-PH", {
               month: "short",
               day: "2-digit",
               year: "numeric",
            })
         : null,
      status: member.is_activated ? 'Active' : 'Inactive',
      points: member.points,

      stats: {
         dayStreak,
         totalVisits,
         thisMonth,
      },
   };
};
 
export const getMemberAttendanceHistoryService = async (
  member_id: number
) => {
  const attendance = await prisma.attendance.findMany({
    where: {
      member_id,
    },
    orderBy: {
      check_in_time: "desc",
    },
    select: {
      id: true,
      check_in_time: true,
    },
  });

  return attendance.map((item) => ({
    id: item.id,

    date: item.check_in_time
      ? new Date(item.check_in_time).toLocaleDateString("en-PH", {
          timeZone: "Asia/Manila",
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      : null,

    time: item.check_in_time
      ? new Date(item.check_in_time).toLocaleTimeString("en-PH", {
          timeZone: "Asia/Manila",
          hour: "2-digit",
          minute: "2-digit",
        })
      : null,
  }));
};

export async function getRecentActivityService(member_id: number){
  const activities = await prisma.activities.findMany({
    where: {
      recipient_type: 'MEMBER',
      recipient_id: member_id
     },
     take:5,
     orderBy:{
       created_at:"desc"
     }
   });

   return activities.map(activity => ({
     name: activity.title,
     action: activity.description,
     time: activity.created_at?.toISOString(),
     type: activity.type
   }));
}

export const createFitnessGoalService = async (data: CreateGoalDTO) => {
  return await prisma.$transaction(async (tx) => {

    const goal = await tx.fitness_goals.create({
      data:{
        member_id:data.member_id,
        goal_type:data.goal_type,
        start_weight:data.current_weight,
        target_weight: data.target_weight,
        current_weight: data.current_weight
      }
    });

    // initial progress snapshot
    await tx.body_progress.create({
      data:{
        goal_id:goal.id,
        member_id:data.member_id,
        previous_weight:data.current_weight,
        current_weight:data.current_weight,
        target_weight:data.target_weight,
      }
    });

    return goal;
  });
};

export const updateFitnessGoalService = async (
	id: number,
	data: UpdateGoalDTO
) => {

	return await prisma.$transaction(async (tx) => {

		const oldGoal = await tx.fitness_goals.findUnique({
			where:{
				id
			}
		});


		if(!oldGoal){
			throw new Error(
				"Fitness goal not found"
			);
		}


		const latestProgress =
			await tx.body_progress.findFirst({
				where:{
					goal_id:id
				},
				orderBy:{
					recorded_at:"desc"
				}
			});


		const previousWeight =
			latestProgress
				? Number(latestProgress.current_weight)
				: Number(oldGoal.start_weight);


		const currentWeight =
			data.current_weight ?? previousWeight;


		const targetWeight =
			data.target_weight ??
			Number(oldGoal.target_weight);



		const totalChange =
			oldGoal.goal_type === "LOSE_WEIGHT"
				? Number(oldGoal.start_weight) - currentWeight
				: currentWeight - Number(oldGoal.start_weight);



		const totalGoalChange =
			Math.abs(
				Number(oldGoal.start_weight) -
				targetWeight
			);



		const progressPercentage =
			totalGoalChange > 0
				? Math.min(
					100,
					Math.max(
						0,
						Math.round(
							(Math.abs(totalChange) /
							totalGoalChange) *
							100
						)
					)
				)
				: 0;



		/**
		 * CASE 1:
		 * Weight changed
		 * Create new progress record
		 */
		if(
			data.current_weight !== undefined &&
			data.current_weight !== previousWeight
		){

			await tx.body_progress.create({
				data:{
					goal_id:id,

					member_id:
						oldGoal.member_id,

					previous_weight:
						previousWeight,

					current_weight:
						currentWeight,

					target_weight:
						targetWeight,

					weight_change:
						currentWeight - previousWeight,

					progress_percentage:
						progressPercentage
				}
			});

		}

		else if(
			data.target_weight !== undefined &&
			data.target_weight !== Number(oldGoal.target_weight) &&
			latestProgress
		){

			await tx.body_progress.update({
				where:{
					id:latestProgress.id
				},

				data:{
					target_weight:
						targetWeight,

					progress_percentage:
						progressPercentage
				}
			});

		}


		const updated =
			await tx.fitness_goals.update({

				where:{
					id
				},

				data:{

					...(data.current_weight !== undefined && {
						current_weight:
							currentWeight
					}),


					...(data.target_weight !== undefined && {
						target_weight:
							targetWeight
					})

				}
			});



		return updated;

	});
};

export const getFitnessGoalService = async (member_id: number) => {
	const goal = await prisma.fitness_goals.findFirst({
		where:{
			member_id
		},

		include:{
			body_progress:{
				orderBy:{
					recorded_at:"asc"
				},

				select:{
					progress_percentage:true
				}
			}
		}

	});

	if(!goal) return null;

	const latestProgress = goal.body_progress[goal.body_progress.length - 1];

	return {
		id: goal.id,
		member_id: goal.member_id,
		goal_type: goal.goal_type,
		start_weight: Number(goal.start_weight),
		current_weight: Number(goal.current_weight),
		target_weight: Number(goal.target_weight),
		progress_percentage: latestProgress ? Number(latestProgress.progress_percentage) : 0,
		status: goal.status
	};
};

export const getFitnessProgressHistoryService = async (member_id: number) => {
	const goal = await prisma.fitness_goals.findFirst({
		where:{
			member_id
		},
		select:{
			id:true,
			goal_type:true
		}
	});

	if(!goal){
		return null;
	}

	const progressHistory = await prisma.body_progress.findMany({
		where:{
			goal_id:goal.id,
			member_id
		},

		orderBy:{
			recorded_at:"desc"
		},

		select:{
			id:true,
			previous_weight:true,
			current_weight:true,
			target_weight:true,
			weight_change:true,
			progress_percentage:true,
			recorded_at:true
		}
	});

	return {
		goal_type:goal.goal_type,
		history: progressHistory.map(item=>({
			id:item.id,
			previous_weight: Number(item.previous_weight),
			current_weight: Number(item.current_weight),
			target_weight: Number(item.target_weight),
			weight_change: Number(item.weight_change),
			progress_percentage: Number(item.progress_percentage),
			recorded_at: item.recorded_at
		}))
	};
};