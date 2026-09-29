import { Group } from "../table/group.js";
import { GroupMember } from "../table/groupMem.js";
import { groupMessage } from "../table/groupMessage.js";
import { User } from "../table/userTable.js";
import { ress } from "./error.js";

export const createGroup = async(req,res) => {
  try {
    const{name,ids,userId} = req.body;

    if (!name?.trim() || !Array.isArray(ids) || !userId) {
      return ress(req, res, 400, "Name, ids and userId are required", false, null);
    }

    const gg = await Group.create({name:name.trim(),adminId:userId});
    const membersArr = [...new Set([userId,...ids])];

    const member = membersArr.map((id)=>({
      "groupId":gg.id,
      "userId":id
    }))
    await GroupMember.bulkCreate(member);

    return ress(req, res, 200, "group created", true, gg);

  } catch (error) {
    return ress(req, res, 500, error.message, false, null);
  }
}

export const addGroupMessages = async(req,res) =>{
  try {
    const{groupId,senderId,text} = req.body;

    if(!groupId || !senderId || !text){
      return ress(req, res, 200, "all info needed", false, null);
    };
    const gg = await groupMessage.create({groupId,senderId,text});
    return ress(req, res, 200, "group got a message", true, gg);

  } catch (error) {
    return ress(req, res, 500, error.message, false, null);
  }
}

export const showAllGroupMessage = async(req,res) => {
  try {
    const{groupId} = req.params;
    const allMessage = await groupMessage.findAll({
      where:{groupId},
      include:[
        {
          model:User,
          attributes:["id","name","profileImage"],
        }
      ],
      order:[["createdAt","ASC"]],
    });
    return ress(req, res, 200, "all messages", true, allMessage);

  } catch (error) {
    return ress(req, res, 500, error.message, false, null);
  }
};

export const showAllGroupNames = async(req,res) => {
  try {
    const gg = await Group.findAll();
    return ress(req, res, 200, "got all groups", true, gg);

  } catch (error) {
    return ress(req, res, 500, error.message, false, null);
  }
}

export const groupName = async(req, res) => {
  try {
    const {groupId} = req.params;
    const ans = await Group.findOne({where:{id:groupId}})
    return ress(req, res, 200, "group name", true, ans);
  } catch (error) {
    return ress(req, res, 500, error.message, false, null);
  }
}