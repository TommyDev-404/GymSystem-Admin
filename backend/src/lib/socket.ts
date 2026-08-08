import { Server } from "socket.io";

let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });


  io.on("connection", (socket) => {


    socket.on("join-admin", () => {
      socket.join("admin-room");
    });


    socket.on(
      "join-member",
      (memberId: number) => {

        socket.join(
          `member-${memberId}`
        );

      }
    );


    socket.on("disconnect", () => {

    });

  });


  return io;
};


export const getIO = () => {
  if (!io) {
    throw new Error(
      "Socket.io not initialized"
    );
  }

  return io;
};