import axios from "axios";

const baseUrl = "http://localhost:5000/admin";

export const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});