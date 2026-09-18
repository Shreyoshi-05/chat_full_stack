import express from  "express";
import { allChats, longPollMessage, storeMessage } from "../controller/messageRouter.js";

export const messageRouter = express.Router();

messageRouter.post("/user/message",storeMessage);
messageRouter.get("/user/longpoll/message",longPollMessage);
messageRouter.get("/chats/:userId/:friendsId",allChats);