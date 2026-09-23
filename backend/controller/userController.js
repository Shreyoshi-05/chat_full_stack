import { Op } from "sequelize";
import { User } from "../table/userTable.js";
import { ress } from "./error.js";
import bcrypt from "bcrypt";
import { message } from "../table/messagesTable.js";

export const signUpController = async (req, res) => {
  console.log(req.body);
  try {
    const { name, phone, email, pass } = req.body;
    if (!name || !phone || !email || !pass) {
      return ress(
        req,
        res,
        500,
        "all input value are not avaliable",
        false,
        null,
      );
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return ress(req, res, 404, "User already exists", false, null);
    }

    const hasspass = await bcrypt.hash(pass, 10);

    await User.create({ name, phone, email, pass: hasspass });
    return ress(req, res, 200, "user signed up", true, null);
  } catch (error) {
    return ress(req, res, 500, error.message, false, null);
  }
};

export const signInController = async (req, res) => {
  try {
    const { email, pass } = req.body;
    if (!email || !pass) {
      return ress(
        req,
        res,
        400,
        "all input value are not avaliable for signin",
        false,
        null,
      );
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return ress(req, res, 404, "user not found", false, null);
    }

    const find = await bcrypt.compare(pass, user.pass);
    if (!find) {
      return ress(req, res, 401, "Invalid  password try again", false, null);
    }
    return ress(req, res, 200, "Login Successful", true, user);
  } catch (error) {
    return ress(req, res, 500, error.message, false, null);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // const { email } = req.params;
    const { userId } = req.params;

    const user = await User.findAll({
      where: {
        id: { [Op.ne]: userId },
      },
      attributes: ["id", "profileImage", "name"],
    });

    const result = await Promise.all(
      user.map(async (uu) => {
        const lastmessage = await message.findOne({
          where: {
            [Op.or]: [
              {
                senderId: userId,
                receiverId: uu.id,
              },
              {
                receiverId: userId,
                senderId: uu.id,
              },
            ],
          },
          order: [["createdAt", "DESC"]],
        });

        return {
          otherUserId:uu.id,
          name: uu.name,
          dp: uu.profileImage,
          chats: lastmessage ? lastmessage.message : "No messages yet",
        };
      }),
    );

    return ress(req, res, 200, "all users", true, result);
  } catch (error) {
    return ress(req, res, 500, error.message, false, null);
  }
};

export const getUserIdByEmail = async (req,res) => {
  try {
    const {email} = req.query;
    const user = await User.findOne({where:{email}});

    if(!user){
      return ress(req, res, 400, "user with that email does't exists", false, null);
    }
    return ress(req, res, 200, "user found", false, user);

  } catch (error) {
    return ress(req, res, 500, error.message, false, null);

  }
}
