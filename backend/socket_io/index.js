import { Server } from "socket.io";
import { socketMessageHandler } from "./handlers/chat.js";
import { personalHendler } from "./handlers/personalChat.js";
import { groupHendler } from "./handlers/groupHendler.js";

export function socketServer(server) {
  const io = new Server(server);

  io.on("connection", (socket) => {

    socket.on("register", (userId) => {
      socket.join(String(userId));
    });

    // socketMessageHandler(io,socket);
    personalHendler(io , socket);
    groupHendler(io,socket);

    socket.on("disconnect", () => {
      console.log("socket.io disconnected");
    });
  });
}
