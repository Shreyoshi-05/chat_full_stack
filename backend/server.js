import express from "express";
import { db } from "./db/db.js";
import { User } from "./table/userTable.js";
import cors from "cors";
import { userRouter } from "./router/userRouter.js";
import { message } from "./table/messagesTable.js";
import { messageRouter } from "./router/messageRouter.js";
import { createServer } from "http";
import { socketServer } from "./socket_io/index.js";
import { groupRouter } from "./router/groupRoute.js";
import { Group } from "./table/group.js";
import { GroupMember } from "./table/groupMem.js";
import { groupMessage } from "./table/groupMessage.js";
import "./table/association.js"
import { mediaRouter } from "./router/mediaRouter.js";
import {ArchivedChat}  from "./table/ArchivedChat.js"
import { ArchiveJob } from "./jobstoDone/archiveMessages.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(userRouter);
app.use(messageRouter);
app.use(groupRouter);
app.use(mediaRouter)



const server = createServer(app);
const io = socketServer(server);
app.set("io",io);



const port = 3003;

console.log("Database:", db.getDatabaseName());
console.log("Group table:", groupMessage.getTableName());
console.log(
  "Group model fields:",
  Object.keys(groupMessage.rawAttributes)
);

// db.sync({ alter: true }).then(()=>{
db.sync({ alter: true, logging: console.log })
  .then(() => {
    ArchiveJob.start();
    
    server.listen(port, () => {
      console.log("server is running on port", port);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });
