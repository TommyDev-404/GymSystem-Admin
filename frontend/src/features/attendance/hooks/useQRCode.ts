import { useQuery } from "@tanstack/react-query";
import { getTodayQrApi } from "../api/qr-code.api";

interface QrResponse {
   qr: string;
 }

export const useTodayQr = () => {
  return useQuery<QrResponse>({
    queryKey: ["session", "today-qr"],
    queryFn: getTodayQrApi
  });
};