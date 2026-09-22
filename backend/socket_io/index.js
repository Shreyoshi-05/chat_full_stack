import { Server } from "socket.io";
import { socketMessageHandler } from "./handlers/chat.js";
import { personalHendler } from "./handlers/personalChat.js";

export function socketServer(server) {
  const io = new Server(server);

  io.on("connection", (socket) => {
    // console.log("socket.io connected", socket);

    // personalHendler(io,socket);

    socket.on("register", (userId) => {
      socket.join(String(userId));
      console.log("registered:", userId);
    });

    socketMessageHandler(io,socket);
    personalHendler(io , socket);

    socket.on("disconnect", () => {
      console.log("socket.io disconnected");
    });
  });
}
