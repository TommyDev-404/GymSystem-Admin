import { api } from "@/lib/axios";
import type { TutorialsFilters } from "../types/TutorialType";

export const createTutorialApi = async (data: FormData) => {
  const res = await api.post("/tutorial/create", data);
  console.log(res);
   return res.data;
};

export const updateTutorialApi = async (id: number, data: FormData) => {
   const res = await api.patch(`/tutorial/update/${id}`, data);
   return res.data;
};

export const getAllTutorialsApi = async (params?: TutorialsFilters) => {
   const res = await api.get("/tutorial/all", { params });
   return res.data;
}

export const removeTutorialApi = async (id: number) => {
   const res = await api.delete(`/tutorial/remove/${id}`);
   return res.data;
}
