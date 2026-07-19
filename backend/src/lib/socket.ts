import { Server } from "socket.io";

let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });


  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);


    socket.on("join-admin", () => {
      socket.join("admin-room");

      console.log(
        `${socket.id} joined admin room`
      );
    });


    socket.on(
      "join-member",
      (memberId: number) => {

        socket.join(
          `member-${memberId}`
        );

        console.log(
          `${socket.id} joined member-${memberId}`
        );

      }
    );


    socket.on("disconnect", () => {
      console.log(
        "Socket disconnected:",
        socket.id
      );
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