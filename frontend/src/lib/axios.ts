import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/admin", //"https://jfitness-gym.tech/api/admin"
  withCredentials: true,
});