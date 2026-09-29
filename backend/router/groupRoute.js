import express from "express";
import { addGroupMessages, createGroup, groupName, showAllGroupMessage, showAllGroupNames } from "../controller/groupController.js";

export const groupRouter = express.Router();

groupRouter.post("/user/groups",createGroup);
groupRouter.post("/groups/messages",addGroupMessages);
groupRouter.get("/show/groups/messages/:groupId",showAllGroupMessage);
groupRouter.get("/get/groups",showAllGroupNames);
groupRouter.get("/get/group/name/:groupId",groupName);
