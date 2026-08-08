import { prisma } from "../../../lib/prisma";
import { Rewards } from "./rewards.types";

export const getAllRewardsService = async () => {
   return await prisma.rewards.findMany({
      select: {
         id: true,
         name: true,
         description: true,
         category: true,
         points_required: true,
         total_claim: true
      },
      orderBy: { createdAt: "desc"}
   });
};

export const createRewardService = async (data: Omit<Rewards, "id">) => {
   const result = await prisma.rewards.create({
      data: {
         name: data.name,
         description: data.description,
         points_required: data.points_required,
         category: data.category,
         total_claim: 0
      }
   });

   if (!result) throw new Error;

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

   return {
      success: true,
      message: "Rewards deleted successfully",
   };
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
      const active = await prisma.members.count({
         where: {
            status: 'Inactive'
         }
      });

      const averagePoints = await prisma.members.aggregate({
         _avg: { points: true }
      });

      const totalRewards = await prisma.rewards.aggregate({
         _count: { id: true}
      });

      const totalClaimed = await prisma.rewards.aggregate({
        _sum: { total_claim: true }
      });

      return {
         active,
         averagePoints: averagePoints._avg.points,
         totalRewards: totalRewards._count.id,
         totalClaimed: totalClaimed._sum.total_claim
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

export const updateRewardRedemptionStatusService = async (
	redemption_id: number,
	status: "Claimed" | "Cancelled"
) => {
	return await prisma.$transaction(async (tx) => {
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
		const updatedRedemption = await tx.reward_redemptions.update({
			where:{ id: redemption_id },
			data:{
				status
			}
		});

		// If cancelled, return points
		if(status === "Cancelled"){
			await tx.members.update({
				where:{ id: redemption.member_id },
				data:{
					points:{
						increment: redemption.points_used
					}
				}
			});
		}

		// Member activity
		await tx.activities.create({
			data:{
				recipient_id: redemption.member_id,
				recipient_type:"MEMBER",
				type:"REWARD",
				title:
					status === "Claimed"
					? "Reward Claimed 🎁"
					: "Reward Redemption Cancelled",
				description:
					status === "Claimed"
					? `You claimed your ${redemption.rewards.name}. Enjoy your reward!`
					: `Your redemption for ${redemption.rewards.name} was cancelled. Your points have been returned.`
			}
		});

		// Member notification
		await tx.notifications.create({
			data:{
				recipient_id:redemption.member_id,
				recipient_type:"MEMBER",
				type:"REWARD",
				title:
					status === "Claimed"
					? "Reward Claimed 🎁"
					: "Reward Cancelled",
				description:
					status === "Claimed"
					? `Your ${redemption.rewards.name} has been claimed successfully.`
					: `Your ${redemption.rewards.name} redemption was cancelled and your points were refunded.`,

				is_read:false
			}
		});

		return {
			success: true,
			message: "Reward status updated successfully."
		};
	});
};
