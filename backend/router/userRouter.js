import express from "express";
import { signInController, signUpController } from "../controller/userController.js";

export const userRouter = express.Router();

userRouter.post("/user/signup",signUpController);
userRouter.post("/user/signin",signInController);