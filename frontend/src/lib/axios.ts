import axios from "axios";

export const api = axios.create({
  baseURL: "https://jfitness-gym.tech/api/admin", //"https://25hnhfvf-5000.asse.devtunnels.ms/admin", //"http://localhost:5000/admin", //
  timeout: 60000,
  withCredentials: true,
});
