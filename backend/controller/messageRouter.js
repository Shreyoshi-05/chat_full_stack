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

    const newMessage = await message.create({
      senderId,
      receiverId,
      message: text,
    });

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
    const { userId, friendsId } = req.params;
    const chats = await message.findAll({
      where: {
        [Op.or]: [
          {
            senderId: userId,
            receiverId: friendsId,
          },
          {
            senderId: friendsId,
            receiverId: userId,
          },
        ],
      },
      order: [["createdAt", "ASC"]],
    });

    const allChats = await Promise.all(
      chats.map(async (cc) => {
        let obj = {
          id: cc.id,
          type: "",
          message: cc.message,
          time: cc.createdAt,
        };

        if (cc.senderId == userId) {
          obj.type = "sent";
        } else {
          obj.type = "received";
        }

        // let tt = new Date(cc.updatedAt);
        // const time = tt.toLocaleTimeString();
        // obj.time = time;

        return obj;
      }),
    );

    return ress(req, res, 200, "all chats", true, allChats);
  } catch (error) {
    return ress(req, res, 500, error.message, false, null);
  }
};

export const longPollMessage = async (req, res) => {
  try {
    const { userId, lastmessageId } = req.params;
    let ans = {
      lastMssId: "",
      message: "",
    };

    const id = setInterval(async () => {
      const mm = await message.findOne({
        where: { receiverId: userId },
        order: [["createdAt", "DESC"]],
      });

      if (mm.id > Number(lastmessageId)) {
        clearInterval(id);
        clearTimeout(timeout);
        
        ans.lastMssId = mm.id;
        ans.message = mm.message;

        return ress(req, res, 200, "new message got", true, {
          lastMssId: mm.id,
          message: mm.message,
          senderId: mm.senderId,
        });
      }
    }, 1000);

    const timeout = setTimeout(() => {
      clearInterval(id);

      return ress(
        req,
        res,
        200,
        "no new message",
        true,
        null
      );
    }, 30000);

  } catch (error) {
    return ress(req, res, 500, error.message, false, null);
  }
};
