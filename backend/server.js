import express from "express";
import { db } from "./db/db.js";
import { User } from "./table/userTable.js";
import cors from "cors";
import { userRouter } from "./router/userRouter.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());

app.use(userRouter);

const port = 3003;


db.sync().then(()=>{
  app.listen(port,()=>{
  console.log("server is running on port", port)
});
})
.catch((error)=>{
  console.log(error.message);
})
