export const personalHendler = (io, socket) => {

  socket.on("join_room",(data)=>{
    const {userId , friendsId} = data;

    console.log("userId",userId);
    console.log("friendsId",friendsId);

    const roomId = [Number(userId),Number(friendsId)].sort((a,b)=> a-b).join("_");
    socket.join(roomId);

    console.log("joined room",roomId);
  });
  
}