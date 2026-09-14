import express from  "express";
import { allChats, storeMessage } from "../controller/messageRouter.js";

export const messageRouter = express.Router();

messageRouter.post("/user/message",storeMessage);
messageRouter.get("/chats/:userId/:friendsId",allChats);