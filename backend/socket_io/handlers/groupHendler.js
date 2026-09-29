import { GroupMember } from "../../table/groupMem.js"
import { groupMessage } from "../../table/groupMessage.js";


export const groupHendler = (io,socket) => {
  socket.on("join_group",async({groupId, userId}) => {
    try {
      const findMem = await GroupMember.findOne({
        where:{groupId,userId}
      });
      if(!findMem){
        socket.emit("you are not in this group");
        return;
      }
      socket.join(`group:${groupId}`);

    } catch (error) {
      socket.emit("groupError",error.message);
    }
  });

  socket.on("leave_group",async({groupId})=>{
    if(groupId) socket.leave(`group:${groupId}`)
  });

  socket.on("sendGroupMessage",async({groupId,senderId,text})=>{
    try {
      if(!groupId || !senderId || !text) return;
  
      const find = await GroupMember.findOne({
        where:{userId:senderId,groupId}
      });
  
      if(!find){
        socket.emit("groupError","u r not in this group");
      }
  
      const save = await groupMessage.create({groupId , senderId , text});
      io.to(`group:${groupId}`).emit("receiveGroupMessage",save.toJSON());
    } catch (error) {
      socket.emit("groupError",error.message);
    }
  })
}