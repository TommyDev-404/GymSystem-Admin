import axios from "axios";

export const api = axios.create({
  baseURL: "https://jfitness-gym.tech/api",
  withCredentials: true,
});