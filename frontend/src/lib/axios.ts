import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/admin", //"https://jfitness-gym.tech/api/admin", //"https://25hnhfvf-5000.asse.devtunnels.ms/admin", //
  timeout: 60000,
  withCredentials: true,
});
