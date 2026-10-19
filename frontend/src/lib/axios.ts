import axios from "axios";

export const api = axios.create({
  baseURL: "https://jfitness-gym.tech/api/admin", //"http://localhost:5000/admin",
  withCredentials: true,
});