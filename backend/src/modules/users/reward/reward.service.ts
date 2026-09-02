import { prisma } from "../../../lib/prisma";
import { getIO } from "../../../lib/socket";


export const getAllRewardsService = async () => {
	const rewards = await prisma.rewards.findMany({
		orderBy: {
			created_at: "desc",
		},
	});

	return rewards;
};

export const getMemberRedeemedRewardsService = async (member_id: number) => {
	const redemptions = await prisma.reward_redemptions.findMany({
		where: {
			member_id,
		},

		orderBy: {
			redeemed_at: "desc",
		},

		include: {
			rewards: {
				select: {
					id: true,
					name: true,
					description: true,
					category: true,
				},
			},
		},
	});

	return redemptions.map((item) => ({
		id: item.id,
		reward_id: item.reward_id,
		name: item.rewards.name,
		description: item.rewards.description,
		category: item.rewards.category,
		points_used: item.points_used,
		status: item.status,
		redeemed_at: item.redeemed_at,
	}));
};

export const redeemRewardService = async (member_id: number, reward_id: number) => {
   const result = await prisma.$transaction(async (tx) => {
      const reward = await tx.rewards.findUnique({
         where: {
            id: reward_id,
         },
      });

      if (!reward) {
         return {
            success: false,
            message: "Reward not found",
         };
      }

      const member = await tx.members.findUnique({
         where: {
            id: member_id,
         },
      });

      if (!member) {
         return {
            success: false,
            message: "Member not found",
         };
      }

      if (member.points < reward.points_required) {
         return {
            success: false,
            message: "Insufficient points",
         };
      }

      await tx.members.update({
         where: {
            id: member_id,
         },
         data: {
            points: {
               decrement: reward.points_required,
            },
         },
      });

      const redemption = await tx.reward_redemptions.create({
         data: {
            member_id,
            reward_id,
            points_used: reward.points_required,
            status: "Pending",
         },
      });

      await tx.activities.create({
         data: {
            recipient_id: redemption.member_id,
            recipient_type: "ADMIN",
            category: "REWARD",
            title: "Reward Redeemed",
            description: `${member.fullname} redeemed the ${reward.name} reward.`,
         },
      });

      await tx.activities.create({
         data: {
            recipient_id: member_id,
            recipient_type: "MEMBER",
            category: "REWARD",
            title: "Reward Redeemed",
            description: `You redeemed ${reward.name}. Claim your reward at the gym.`,
         },
      });

      return {
         success: true,
         message: "Reward redeemed successfully.",
      };
   });

   if (!result.success) {
      return result;
   }

   getIO()
      .to("admin-room")
      .emit("reward:redeemed", {
         memberId: member_id,
      });

   return result;
};

export const cancelRedeemedRewardService = async (redemption_id: number, member_id: number) => {
   const result = await prisma.$transaction(async (tx) => {
      const redemption = await tx.reward_redemptions.findFirst({
         where: {
            id: redemption_id,
            member_id,
         },
         include: {
            rewards: {
               select: {
                  id: true,
                  name: true,
               },
            },
            members: {
               select: {
                  id: true,
                  fullname: true,
               },
            },
         },
      });

      if (!redemption) {
         return {
            success: false,
            message: "Reward redemption not found",
         };
      }

      if (redemption.status !== "Pending") {
         return {
            success: false,
            message: "Only pending rewards can be cancelled",
         };
      }

      const redeemedDate = new Date(redemption.redeemed_at!);
      const startOfDay = new Date(redeemedDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(redeemedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const cancellationCount = await tx.reward_redemptions.count({
         where: {
            member_id,
            status: "Cancelled",
            redeemed_at: {
               gte: startOfDay,
               lte: endOfDay,
            },
         },
      });

      if (cancellationCount >= 3) {
         return {
            success: false,
            message: "You can only cancel three reward redemption per day.",
         };
      }

      await tx.reward_redemptions.update({
         where: {
            id: redemption_id,
         },
         data: {
            status: "Cancelled",
         },
      });

      await tx.members.update({
         where: {
            id: member_id,
         },
         data: {
            points: {
               increment: redemption.points_used,
            },
         },
      });

      await tx.notifications.create({
         data: {
            recipient_id: member_id,
            recipient_type: "MEMBER",
            type: "REWARD_CANCELLED",
            title: "Reward Redemption Cancelled",
            description: `${redemption.rewards.name} redemption was cancelled. ${redemption.points_used} points have been returned.`,
            is_read: false,
         },
      });

      await tx.notifications.create({
         data: {
            recipient_id: redemption.member_id,
            recipient_type: "ADMIN",
            type: "REWARD_CANCELLED",
            title: "Reward Redeem Cancelled",
            description: `${redemption.members.fullname} cancelled redeeming the ${redemption.rewards.name}. Points were returned.`,
            is_read: false,
         },
      });

      await tx.activities.create({
         data: {
            recipient_id: member_id,
            recipient_type: "MEMBER",
            category: "REWARD",
            title: "Reward Cancelled Redeeming",
            description: `You cancelled your ${redemption.rewards.name} reward redemption. ${redemption.points_used} points were refunded.`,
         },
      });

      return {
         success: true,
         message: "Reward redemption cancelled successfully",
      };
   });

   if (!result.success) {
      return result;
   }

   getIO()
      .to("admin-room")
      .emit("reward:cancel-redeemed", {
         memberId: member_id,
      });

   return result;
};