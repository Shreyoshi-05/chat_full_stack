import express from "express";
import { db } from "./db/db.js";
import { User } from "./table/userTable.js";
import cors from "cors";
import { userRouter } from "./router/userRouter.js";
import { message } from "./table/messagesTable.js";
import { messageRouter } from "./router/messageRouter.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());

app.use(userRouter);
app.use(messageRouter);

const port = 3003;


// db.sync({ alter: true }).then(()=>{
db.sync().then(()=>{
  app.listen(port,()=>{
  console.log("server is running on port", port)
});
})
.catch((error)=>{
  console.log(error.message);
})
