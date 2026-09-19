import express from "express";
import { db } from "./db/db.js";
import { User } from "./table/userTable.js";
import cors from "cors";
import { userRouter } from "./router/userRouter.js";
import { message } from "./table/messagesTable.js";
import { messageRouter } from "./router/messageRouter.js";
import { createServer } from "http";
// import { WebSocketServer } from "ws";
import { Server } from "socket.io";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(userRouter);
app.use(messageRouter);

const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  // console.log("socket.io connected", socket);

  socket.on("register", (userId) => {
    socket.join(String(userId));
    console.log("registered:", userId);
  });


  socket.on("sendMessage", async (data) => {
    console.log("message received:", data);

    try {
      const newMessage = await message.create({
        senderId: data.senderId,
        receiverId: data.receiverId,
        message: data.text,
      });
  
      // Receiver
      io.to(String(data.receiverId)).emit("receiveMessage", newMessage);
  
      // Sender
      socket.emit("receiveMessage", newMessage);
      
    } catch (error) {
      console.log(error.message);
    }
  });


  socket.on("disconnect", () => {
    console.log("socket.io disconnected");
  });

});

// const wss = new WebSocketServer({ server });

const users = new Map();

// wss.on("connection", (ws) => {
//   console.log("websocket client connected");

//   ws.on("message", async (data) => {
//     const parsedData = JSON.parse(data.toString());
//     console.log(parsedData);

//     if (parsedData.type == "register") {
//       users.set(Number(parsedData.userId), ws);
//       console.log("registered:", parsedData.userId);
//       return;
//     }

//     // const receiverWs = users.get(Number(parsedData.receiverId));
//     // console.log("receiver socket:", receiverWs);

//     // if (receiverWs) {
//     //   receiverWs.send(
//     //     JSON.stringify({
//     //       senderId: parsedData.senderId,
//     //       receiverId: parsedData.receiverId,
//     //       text: parsedData.text,
//     //     }),
//     //   );
//     // }

//     if (parsedData.type === "message") {
//       const newMessage = await message.create({
//         senderId: parsedData.senderId,
//         receiverId: parsedData.receiverId,
//         message: parsedData.text,
//       });

//       const receiverWs = users.get(Number(parsedData.receiverId));
//       if (receiverWs) {
//         receiverWs.send(
//           JSON.stringify({
//             type: "message",
//             data: newMessage,
//           }),
//         );
//       }

//       ws.send(
//         JSON.stringify({
//           type: "message",
//           data: newMessage,
//         }),
//       );
//     }
//   });

//   ws.on("close", () => {
//     console.log("websocket client disconnected");
//   });
// });

const port = 3003;

// db.sync({ alter: true }).then(()=>{
db.sync()
  .then(() => {
    server.listen(port, () => {
      console.log("server is running on port", port);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });
