import { message } from "../../table/messagesTable.js";

export const personalHendler = (io, socket) => {

  //join perosonal room

  socket.on("join_room",(data)=>{
    const {userId , friendsId} = data;

    // console.log("userId",userId);
    // console.log("friendsId",friendsId);

    const roomId = [Number(userId),Number(friendsId)].sort((a,b)=> a-b).join("_");
    socket.join(roomId);
  });

  //join personal message

  socket.on("sendMessage",async(data) => {
    // console.log(data);

    const {
        roomId,
        senderId,
        receiverId,
        text
      } = data;

    try {
      const newMessage = await message.create({
        senderId:senderId,
        receiverId:receiverId,
        message:text
      });

      io.to(roomId).emit("receiveMessage",newMessage);

    } catch (error) {
      console.log(error.message);
    }
  })
  
}