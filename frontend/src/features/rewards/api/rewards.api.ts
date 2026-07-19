import { api } from "@/lib/axios";
import type { Rewards } from "../types/RewardsType";

export const getRewardsApi = async () => {
   const res = await api.get("/reward/get-rewards");
   return res.data;
};

export const createRewardApi = async (data: Omit<Rewards, "id">) => {
   const res = await api.post("/reward/create", data);
   return res.data;
};

export const updateRewardApi = async (id: number, data: Partial<Rewards>) => {
   const res = await api.patch(`/reward/update/${id}`, data);
   return res.data;
};

export const deleteRewardApi = async (id: number) => {
   const res = await api.delete(`/reward/delete/${id}`);
   return res.data;
};

export const getMembersProgressApi = async () => {
   const res = await api.get("/reward/members-progress");
   return res.data;
};

export const getSummaryDataApi = async () => {
   const res = await api.get("/reward/card-data");
   return res.data;
};
