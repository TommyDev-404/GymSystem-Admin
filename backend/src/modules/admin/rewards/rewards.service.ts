import { prisma } from "../../../lib/prisma";
import { getIO } from "../../../lib/socket";
import { Rewards } from "./rewards.types";

export const getAllRewardsService = async () => {
	const rewards = await prisma.rewards.findMany({
		select: {
			id: true,
			name: true,
			description: true,
			category: true,
			points_required: true,

			_count: {
				select: {
					reward_redemptions: true,
				},
			},
		},

		orderBy: {
			createdAt: "desc",
		},
	});

	return rewards.map((reward) => ({
		id: reward.id,
		name: reward.name,
		description: reward.description,
		category: reward.category,
		points_required: reward.points_required,
		total_claim: reward._count.reward_redemptions,
	}));
};

export const getMemberProgressService = async () => {
   return await prisma.members.findMany({
      select: {
         fullname: true,
         points: true
      },
      orderBy: { fullname: 'asc'}
   });
};

export const getSummaryDataService = async () => {
   return await prisma.$transaction(async (tx) => { 
      const totalRedeemed = await prisma.reward_redemptions.count({
         where: {
            status: "Pending"
         }
      });

      const averagePoints = await prisma.members.aggregate({
         _avg: { points: true }
      });

      const totalRewards = await prisma.rewards.aggregate({
         _count: { id: true}
      });

		const totalClaimed = await prisma.reward_redemptions.count({
			where: {
				status: "Claimed"
			}
      });

      return {
         totalRedeemed,
         totalClaimed,
         averagePoints: averagePoints._avg.points,
         totalRewards: totalRewards._count.id
      }
   });
};

export const getAllRewardRedemptionsService = async () => {
	const redemptions = await prisma.reward_redemptions.findMany({
		orderBy:{ redeemed_at:"desc" },
		include:{
			members:{
				select:{
					id:true,
					fullname:true,
				}
			},

			rewards:{
				select:{
					id:true,
					name:true,
					description:true,
					category:true,
				}
			}
		}
	});

	return redemptions.map((item)=>({
		id:item.id,
		member_id:item.member_id,
		member_name:item.members.fullname,
		reward_id:item.reward_id,
		reward_name:item.rewards.name,
		reward_category:item.rewards.category,
		points_used:item.points_used,
		status:item.status,
		redeemed_at:item.redeemed_at,
	}));
};

export const createRewardService = async (data: Omit<Rewards, "id">) => {
   const result = await prisma.rewards.create({
      data: {
         name: data.name,
         description: data.description,
         points_required: data.points_required,
         category: data.category
      }
   });

   if (!result) throw new Error;

	// Socket events
	getIO()
	.to("members-room")
	.emit(
		"reward:new",
		{
			rewardId: result.id
		}
	);
	
   return {
     success: true,
     message: "Rewards created successfully",
   };
};

export const updateRewardService = async (id: number, data: any) => {
   const result = await prisma.rewards.update({
      where: { id },
      data: data
   });

	if (!result) throw new Error;
	
	// Socket events
	getIO()
	.to("members-room")
	.emit(
		"reward:update",
		{
			rewardId: result.id
		}
	);

   return {
     success: true,
     message: "Rewards updated successfully",
   };
};

export const deleteRewardService = async (id: number) => {
   const result = await prisma.rewards.delete({
      where: { id }
   });

	if (!result) throw new Error;
	
	// Socket events
	getIO()
	.to("members-room")
	.emit(
		"reward:remove",
		{
			rewardId: result.id
		}
	);

   return {
      success: true,
      message: "Rewards deleted successfully",
   };
};

export const updateRewardRedemptionStatusService = async (
	redemption_id: number,
	status: "Claimed" 
) => {
	const result = await prisma.$transaction(async (tx) => {
		// Get redemption details
		const redemption = await tx.reward_redemptions.findUnique({
			where:{ id: redemption_id },
			include:{
				members:{
					select:{
						id:true,
						fullname:true,
					}
				},

				rewards:{
					select:{
						id:true,
						name:true,
						points_required:true,
					}
				}
			}
		});

		if(!redemption) throw new Error("Reward redemption not found");

		if(redemption.status !== "Pending") throw new Error("Reward redemption already processed");

		// Update redemption status
		await tx.reward_redemptions.update({
			where:{ id: redemption_id },
			data:{
				status
			}
		});

		// Admin activity
		await tx.activities.create({
			data:{
				recipient_id: redemption.member_id,
				recipient_type: "ADMIN",
				category: "REWARD",
				title: "Reward Claimed",
				description:`${redemption.members.fullname} successfully claimed the ${redemption.rewards.name} reward.`
			}
		});

		// Admin notification
		await tx.notifications.create({
			data:{
				recipient_id: redemption.member_id,
				recipient_type: "ADMIN",
				type: "REWARD_CLAIMED",
				title: "Reward Claimed",
				description: `${redemption.members.fullname} has been claimed successfully.`,
				is_read:false
			}
		});

		// Member activity
		await tx.activities.create({
			data:{
				recipient_id: redemption.member_id,
				recipient_type: "MEMBER",
				category: "REWARD",
				title: "Reward Claimed ",
				description:  `You claimed your ${redemption.rewards.name}. Enjoy your reward!`
			}
		});

		// Member notification
		await tx.notifications.create({
			data: {
				recipient_id: redemption.member_id,
				recipient_type: "MEMBER",
				type: "REWARD_CLAIMED",
				title: "Reward Claimed",
				description: `Your ${redemption.rewards.name} has been claimed successfully.`,
				is_read:false
			}
		});

		return {
			success: true,
			message: "Reward status updated successfully.",
			memberId: redemption.member_id
		};
	});
	
	// Socket events
	getIO()
	.to(`member-${result.memberId}`)
	.emit(
		"reward:claimed",
		{
			memberId: result.memberId
		}
	);

	return result;
};
