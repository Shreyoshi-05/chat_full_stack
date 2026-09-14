import { ress } from "./error.js";
import { message } from "../table/messagesTable.js";
import { Op } from "sequelize";

export const storeMessage = async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;

    // if()

    if (!senderId || !receiverId || !text) {
      return ress(req, res, 404, "all data is needed for message", false, null);
    }

    const newMessage = await message.create({ senderId, receiverId, message:text });

    return ress(
      req,
      res,
      200,
      "message data successfully updated",
      true,
      newMessage,
    );
  } catch (error) {
    return ress(req, res, 500, error.message, false, null);
  }
};

export const allChats = async (req, res) => {

  try {
    const {userId,friendsId} = req.params;
    const chats = await message.findAll({
      where:{
        [Op.or]:[
          {
            senderId:userId,
            receiverId:friendsId
          },
          {
            senderId:friendsId,
            receiverId:userId
          }
        ]
      },
      order:[["createdAt","ASC"]]
    });

    const allChats = await Promise.all(
      chats.map(async(cc)=>{
        let obj = {
          type:"",
          message:cc.message,
          time: ""
        };

        if(cc.senderId == userId){
          obj.type = "sent"
        }else{
          obj.type = "received";
        }

        let tt = new Date(cc.updatedAt);
        const time = tt.toLocaleTimeString();
        obj.time = time;

        return obj;
      })
    )

    return ress(req,res,200,"all chats",true,allChats);

  } catch (error) {
    return ress(req,res,500,error.message,false,null);
  }
};
