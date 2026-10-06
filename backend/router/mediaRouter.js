import express from "express";
import { upload } from "../middleware/upload.js";
import { uploadMedia } from "../controller/mediaController.js";


export const mediaRouter = express.Router();

mediaRouter.post("/media/upload", upload.single("file"),uploadMedia)