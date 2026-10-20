import { prisma } from "../../../lib/prisma.js";
import { getEngagementStatus } from "../../../utils/engagementStatus.js";
import { CreateGoalDTO, UpdateGoalDTO } from "./home.types.js";

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

export const getMemberDashboardDataService = async (
	member_id: number,
 ) => {
	const now = new Date();
 
	const startOfMonth = new Date(
	  now.getFullYear(),
	  now.getMonth(),
	  1,
	);
 
	const member = await prisma.members.findUnique({
	  where: {
		 id: member_id,
	  },
	  select: {
		 id: true,
		 users: {
			select: {
			  username: true,
			},
		 },
		 email: true,
		 member_memberships: {
			 select: {
				id: true,
			  start_date: true,
			  end_date: true,
			  status: true,
			  created_at: true,
			  membership_plans: {
				 select: {
					plan_name: true,
				 },
			  },
			},
			orderBy: {
			  created_at: "desc",
			},
		 },
		 attendance: {
			select: {
			  morning_checkin_time: true,
			  morning_checkout_time: true,
			  afternoon_checkin_time: true,
			  afternoon_checkout_time: true,
			},
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
		 member_id: member.id,
		 OR: [
			{
			  morning_checkin_time: {
				 gte: startOfMonth,
				 lte: now,
			  },
			},
			{
			  afternoon_checkin_time: {
				 gte: startOfMonth,
				 lte: now,
			  },
			},
		 ],
	  },
	});
 
	const checkInTimes = member.attendance
	  .flatMap((attendance) => [
		 attendance.morning_checkin_time,
		 attendance.afternoon_checkin_time,
	  ])
	  .filter((date): date is Date => date !== null)
	  .sort((a, b) => b.getTime() - a.getTime());
 
	const lastAttendance = checkInTimes[0] ?? null;
 
	const dayKeyFormatter = new Intl.DateTimeFormat("en-CA", {
	  timeZone: "Asia/Manila",
	  year: "numeric",
	  month: "2-digit",
	  day: "2-digit",
	});
 
	const uniqueAttendanceDates = new Map<string, Date>();
 
	for (const checkInTime of checkInTimes) {
	  const dayKey = dayKeyFormatter.format(checkInTime);
 
	  if (!uniqueAttendanceDates.has(dayKey)) {
		 uniqueAttendanceDates.set(dayKey, checkInTime);
	  }
	}
 
	const dayStreak = calculateStreak(
	  Array.from(uniqueAttendanceDates.values()).sort(
		 (a, b) => b.getTime() - a.getTime(),
	  ),
	);
 
	const engagementStatus = getEngagementStatus(lastAttendance);
 
	const latestMembership = member.member_memberships[0] ?? null;
 
	return {
	  id: member.id,
	  username: member.users?.username,
	  membership_start: latestMembership?.start_date ?? null,
	  membership_id: latestMembership?.id ?? null,
	  plan: latestMembership?.membership_plans.plan_name ?? null,
	  expiry: latestMembership?.end_date ?? null,
	  membershipStatus: latestMembership?.status ?? null,
	  engagementStatus,
	  points: member.points,
	  stats: {
		 dayStreak,
		 totalVisits,
		 thisMonth,
	  },
	};
};
 
export const getMemberAttendanceHistoryService = async (
	member_id: number,
) => {
	const attendance = await prisma.attendance.findMany({
	where: {
		member_id,
	},
	select: {
		id: true,
		morning_checkin_time: true,
		morning_checkout_time: true,
		afternoon_checkin_time: true,
		afternoon_checkout_time: true,
	},
	});

	const formatPhilippineDate = (date: Date | null) => {
	if (!date) return null;

	return new Date(date).toLocaleDateString("en-PH", {
		timeZone: "Asia/Manila",
		month: "short",
		day: "2-digit",
		year: "numeric",
	});
	};

	const formatPhilippineTime = (date: Date | null) => {
	if (!date) return null;

	return new Date(date).toLocaleTimeString("en-PH", {
		timeZone: "Asia/Manila",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
	};

	return attendance
	.map((item) => {
		const checkInTimes = [
			item.morning_checkin_time,
			item.afternoon_checkin_time,
		].filter((date): date is Date => date !== null);

		const latestCheckIn =
			checkInTimes.length > 0
			? new Date(
					Math.max(...checkInTimes.map((date) => date.getTime())),
				)
			: null;

		return {
			id: item.id,
			date: formatPhilippineDate(latestCheckIn),

			morningCheckInTime: formatPhilippineTime(
			item.morning_checkin_time,
			),
			morningCheckOutTime: formatPhilippineTime(
			item.morning_checkout_time,
			),

			afternoonCheckInTime: formatPhilippineTime(
			item.afternoon_checkin_time,
			),
			afternoonCheckOutTime: formatPhilippineTime(
			item.afternoon_checkout_time,
			),

			latestCheckIn,
		};
	})
	.sort((a, b) => {
		return (b.latestCheckIn?.getTime() ?? 0) -
			(a.latestCheckIn?.getTime() ?? 0);
	})
	.map(({ latestCheckIn, ...item }) => item);
};

export const getRecentActivityService  = async (member_id: number) => {
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
		type: activity.category
	}));
}

export const getFitnessGoalService = async (member_id: number) => {
	const goal = await prisma.fitness_goals.findFirst({
		where:{
			member_id,
			status: 'ACTIVE'
		},

		include:{
			body_progress: {
				orderBy: {
				  recorded_at: "desc",
				},
				take: 1,
				select: {
				  progress_percentage: true,
				},
			 }
		}

	});

	if(!goal) return null;

	const latestProgress = goal.body_progress[0];

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
	  where: {
			member_id,
		  status: "ACTIVE"
	  },
 
	  select: {
		 id: true,
		 goal_type: true,
	  },
	});
 
	if (!goal) return null;
 
	const progressHistory = await prisma.body_progress.findMany({
		where: {
			goal_id: goal.id,
			member_id,
		},
		orderBy: {
			recorded_at: "desc",
		},
		select: {
			id: true,
			previous_weight: true,
			current_weight: true,
			target_weight: true,
			weight_change: true,
			progress_percentage: true,
			recorded_at: true,
		},
	});
 
	return progressHistory.map((item) => ({
		 id: item.id,
		 goal_type: goal.goal_type,
		 previous_weight: Number(item.previous_weight),
		 current_weight: Number(item.current_weight),
		 target_weight: Number(item.target_weight),
		 weight_change: Number(item.weight_change),
		 progress_percentage: Number(item.progress_percentage),
		 recorded_at: item.recorded_at,
	}));
};

export const getTabBadgeCounts = async (memberId: number) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const startOfTomorrow = new Date(startOfDay);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const [notificationCount, communityCount] = await Promise.all([
    prisma.notifications.count({
      where: {
        recipient_id: memberId,
		  recipient_type: "MEMBER",
        is_read: false
      },
	 }),
	  
    prisma.posts.count({
      where: {
        created_at: {
          gte: startOfDay,
          lt: startOfTomorrow,
        },
      },
    }),
  ]);

  return {
    notificationCount,
    communityCount,
  };
}

export const createFitnessGoalService = async (member_id: number, data: CreateGoalDTO) => {
	return await prisma.$transaction(async (tx) => {
		const goal = await tx.fitness_goals.create({
			data:{
				member_id: member_id,
				goal_type: data.goal_type,
				start_weight: data.current_weight,
				target_weight: data.target_weight,
				current_weight: data.current_weight
			}
		});

		// initial progress snapshot
		await tx.body_progress.create({
			data:{
				goal_id: goal.id,
				member_id: member_id,
				previous_weight: data.current_weight,
				current_weight: data.current_weight,
				target_weight: data.target_weight,
			}
		});

		return {
			success: true,
			message: "Fitness goal created."
		};
	});
};

export const updateFitnessGoalService = async (member_id: number, data: UpdateGoalDTO) => {
	return await prisma.$transaction(async (tx) => {
		const oldGoal = await tx.fitness_goals.findUnique({
			where: {
				id: member_id,
			},
		});

		if (!oldGoal) {
			throw new Error("Fitness goal not found");
		}

		const latestProgress = await tx.body_progress.findFirst({
			where: {
				goal_id: member_id,
			},
			orderBy: {
				recorded_at: "desc",
			},
		});

		const previousWeight = latestProgress
			? Number(latestProgress.current_weight)
			: Number(oldGoal.start_weight);

		const currentWeight = data.current_weight ?? previousWeight;
		const targetWeight = data.target_weight ?? Number(oldGoal.target_weight);
		const startWeight = Number(oldGoal.start_weight);

		const isAchieved = oldGoal.goal_type === "LOSE_WEIGHT"
			? currentWeight <= targetWeight
			: currentWeight >= targetWeight;

		let progressPercentage = 0;

		if (isAchieved) {
			progressPercentage = 100;
		} else {
			const goalDistance = Math.abs(targetWeight - startWeight);

			if (goalDistance > 0) {
				if (oldGoal.goal_type === "LOSE_WEIGHT") {
					progressPercentage = ((startWeight - currentWeight) / goalDistance) * 100;
				} else {
					progressPercentage = ((currentWeight - startWeight) / goalDistance) * 100;
				}
			}

			progressPercentage = Math.min(100,
				Math.max(0, Math.round(progressPercentage))
			);
		}

		if ( data.current_weight !== undefined && data.current_weight !== previousWeight) {
			await tx.body_progress.create({
				data: {
					goal_id: member_id,
					member_id: oldGoal.member_id,
					previous_weight: previousWeight,
					current_weight: currentWeight,
					target_weight: targetWeight,
					weight_change: currentWeight - previousWeight,
					progress_percentage: progressPercentage,
				},
			});
		}

		else if (
			data.target_weight !== undefined &&
			data.target_weight !==
			Number(oldGoal.target_weight) &&
			latestProgress
		) {
			await tx.body_progress.update({
				where: {
					id: latestProgress.id,
				},

				data: {
					target_weight:
						targetWeight,

					progress_percentage:
						progressPercentage,
				},
			});
		}

		const updated = await tx.fitness_goals.update({
			where: {
				id: member_id,
			},
			
			data: {
				...(data.current_weight !== undefined && {
					current_weight:
					currentWeight,
				}),

				...(data.target_weight !== undefined && {
					target_weight:
					targetWeight,
				}),

				status: isAchieved
					? "ACHIEVED"
					: "ACTIVE",
			},
			});

		return updated;
	});
};
