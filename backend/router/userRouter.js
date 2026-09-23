import express from "express";
import { getAllUsers, getUserIdByEmail, signInController, signUpController } from "../controller/userController.js";

export const userRouter = express.Router();

userRouter.post("/user/signup",signUpController);
userRouter.post("/user/signin",signInController);
userRouter.get("/user/all/:userId",getAllUsers);
userRouter.get("/user/findByemail",getUserIdByEmail);
