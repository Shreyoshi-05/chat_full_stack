import { Server } from "socket.io";
import { socketMessageHandler } from "./handlers/chat.js";

export function socketServer(server) {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("socket.io connected", socket);

    socket.on("register", (userId) => {
      socket.join(String(userId));
      console.log("registered:", userId);
    });

    socketMessageHandler(io,socket);

    socket.on("disconnect", () => {
      console.log("socket.io disconnected");
    });
  });
}
