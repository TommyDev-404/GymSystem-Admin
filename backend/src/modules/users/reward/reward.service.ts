import { prisma } from "../../../lib/prisma";


export const getAllRewardsService = async () => {
  const rewards = await prisma.rewards.findMany({
    orderBy: {
      createdAt: "desc",
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

export const redeemRewardService = async (
  member_id: number,
  reward_id: number
) => {

  return await prisma.$transaction(async (tx) => {
    // 1. Get reward
    const reward = await tx.rewards.findUnique({
      where:{
        id: reward_id
      }
    });

    if(!reward){
      throw new Error("Reward not found");
    }

    // 2. Get member
    const member = await tx.members.findUnique({
      where:{
        id: member_id
      }
    });

    if(!member){
      throw new Error("Member not found");
    }

    // 3. Check points
    if(member.points < reward.points_required){
      throw new Error(
        "Insufficient points"
      );
    }

    // 4. Deduct member points
    await tx.members.update({
      where:{
        id:member_id
      },

      data:{
        points:{
          decrement: reward.points_required
        }
      }
    });

    // 5. Insert redemption record
    const redemption = await tx.reward_redemptions.create({
        data:{
          member_id,
          reward_id,
          points_used: reward.points_required,
          status:"Pending"
        }
      });

    // 6. Update reward claim count
    await tx.rewards.update({
      where:{
        id:reward_id
      },
      data:{
        total_claim:{
          increment:1
        }
      }
    });

     
    // Member recent activity
    await tx.activities.create({
      data: {
        recipient_id: member_id,
        recipient_type: "MEMBER",
        type: "REWARD",
        title: "Reward Redeemed",
        description: `You redeemed ${reward.name}. Claim your reward at the gym.`,
      }
    });
    
    // Member notification
    await tx.notifications.create({
      data: {
        recipient_id: member_id,
        recipient_type: "MEMBER",
        type: "REWARD",
        title: "Reward Redeemed",
        description: `You redeemed ${reward.name}. Claim your reward now.`,
        is_read: false,
      }
    });
     
    return redemption;
  });
};

export const cancelRedeemedRewardService = async (
  redemption_id: number,
  member_id: number
) => {
  return await prisma.$transaction(async (tx) => {

    // Get redemption details
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
      throw new Error("Reward redemption not found");
    }


    // Only pending rewards can be cancelled
    if (redemption.status !== "Pending") {
      throw new Error(
        "Only pending rewards can be cancelled"
      );
    }

    // Cancel redemption
    await tx.reward_redemptions.update({
      where: {
        id: redemption_id,
      },

      data: {
        status: "Cancelled",
      },
    });

    // Refund points
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

    // MEMBER NOTIFICATION
    await tx.notifications.create({
      data: {
        recipient_id: member_id,
        recipient_type: "MEMBER",
        type: "REWARD",
        title: "Reward Redemption Cancelled",
        description: `${redemption.rewards.name} redemption was cancelled. ${redemption.points_used} points have been returned.`,
        is_read: false,
      },
    });

    // MEMBER ACTIVITY
    await tx.activities.create({
      data: {
        recipient_id: member_id,
        recipient_type: "MEMBER",
        type: "REWARD",
        title: "Reward Cancelled Redeeming",
        description:`You cancelled your ${redemption.rewards.name} reward redemption. ${redemption.points_used} points were refunded.`,
      }
    });

    return {
      success: true,
      message: "Reward redemption cancelled successfully"
    };

  });
};