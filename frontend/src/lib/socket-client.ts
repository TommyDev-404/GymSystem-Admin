import { io } from "socket.io-client";

export const socket = io(window.location.origin, {
  autoConnect: false,
  withCredentials: true,
  reconnection: true,
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
  console.log("Transport:", socket.io.engine.transport.name);
});

socket.on("connect_error", (error) => {
  console.error("Socket connection failed:", error.message);
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
});