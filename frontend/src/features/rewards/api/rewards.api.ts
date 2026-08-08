import { api } from "@/lib/axios";
import type { Rewards } from "../types/RewardsType";

export const getRewardsApi = async () => {
   try {
      const res = await api.get("/reward/get-rewards");
      return res.data;
   } catch (error) {
      console.log("Error: ", error)
   }
};

export const createRewardApi = async (data: Omit<Rewards, "id">) => {
   try {
      const res = await api.post("/reward/create", data);
      return res.data;
   } catch (error) {
      console.log("Error: ", error)
   }
};

export const updateRewardApi = async (id: number, data: Partial<Rewards>) => {
   try {
      const res = await api.patch(`/reward/update/${id}`, data);
      return res.data;
   } catch (error) {
      console.log("Error: ", error)
   }
};

export const deleteRewardApi = async (id: number) => {
   try {
      const res = await api.delete(`/reward/delete/${id}`);
      return res.data;
   } catch (error) {
      console.log("Error: ", error)
   }
};

export const getMembersProgressApi = async () => {
   try {
      const res = await api.get("/reward/members-progress");
      return res.data;
   } catch (error) {
      console.log("Error: ", error)
   }
};

export const getSummaryDataApi = async () => {
   try {
      const res = await api.get("/reward/card-data");
      return res.data;
   } catch (error) {
      console.log("Error: ", error)
   }
};

export const getRewardRedemptionsApi = async () => {
   try {
      const res = await api.get("/reward/redemptions");
      return res.data;

   } catch (error) {
      console.log("Error: ", error)
   }
};

export const updateRewardRedemptionStatusApi = async (remption_id: number, status: string) => {
   try {
      const res = await api.patch(`/reward/update-redemptions-status/${remption_id}`, { status });
      return res.data;
      
   } catch (error) {
      console.log("Error: ", error)
   }
};