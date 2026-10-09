import express from  "express";
import { allChats, generateMessages, getFriendsDetails, getUserDeatils, longPollMessage, storeMessage } from "../controller/messageRouter.js";

export const messageRouter = express.Router();

messageRouter.post("/user/message",storeMessage);
messageRouter.get("/user/longpoll/message",longPollMessage);
messageRouter.get("/chats/:userId/:friendsId",allChats);
messageRouter.get("/details/:friendsId",getFriendsDetails);
messageRouter.get("/user/details/:userId",getUserDeatils);
messageRouter.post("/generate/message",generateMessages);

