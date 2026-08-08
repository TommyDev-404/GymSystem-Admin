import { api } from "@/lib/axios";
import type { TutorialsFilters } from "../types/TutorialType";

export const createTutorialApi = async (data: FormData) => {
   try {
      const res = await api.post("/tutorial/create", data);
      return res.data;
   } catch (error) {
      console.log("Error: ", error);
   }
};

export const updateTutorialApi = async (id: number, data: FormData) => {
   try {
      const res = await api.patch(`/tutorial/update/${id}`, data);
      return res.data;
   } catch (error) {
      console.log("Error: ", error);
   }
};

export const getAllTutorialsApi = async (params?: TutorialsFilters) => {
   try {
      const res = await api.get("/tutorial/all", { params });
      return res.data;
   } catch (error) {
      console.log("Error: ", error);
   }
}

export const removeTutorialApi = async (id: number) => {
   try {
      const res = await api.delete(`/tutorial/remove/${id}`);
      return res.data;
   } catch (error) {
      console.log("Error: ", error);
   }
}
