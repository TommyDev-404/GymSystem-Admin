import { prisma } from "../../../lib/prisma";
import { Rewards } from "./rewards.types";

export const getAllRewardsService = async () => {
   const result = await prisma.rewards.findMany({
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

   if (!result) throw new Error;

   return result;
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
   const result = await prisma.members.findMany({
      select: {
         fullname: true,
         points: true
      },
      orderBy: { fullname: 'asc'}
   });

   if (!result) throw new Error;

   return result;
};

export const getSummaryDataService = async () => {
   const result = await prisma.$transaction(async (tx) => { 
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

   if (!result) throw new Error;

   return result;
};
