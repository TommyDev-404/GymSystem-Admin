import { Server } from "socket.io";
let io;
export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
        },
    });
    io.on("connection", (socket) => {
        socket.on("join-admin", () => { socket.join("admin-room"); });
        socket.on("join-member", (memberId) => {
            socket.join(`member-${memberId}`);
            socket.join("members-room");
        });
        socket.on("disconnect", () => { });
    });
    return io;
};
export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};
