import { message } from "../../table/messagesTable.js";


export function socketMessageHandler(io,socket){
  socket.on("sendMessage", async (data) => {
      console.log("message received:", data);
  
      try {
        const newMessage = await message.create({
          senderId: data.senderId,
          receiverId: data.receiverId,
          message: data.text,
        });
  
        // Receiver
        io.to(String(data.receiverId)).emit("receiveMessage", newMessage);
  
        // Sender
        socket.emit("receiveMessage", newMessage);
      } catch (error) {
        console.log(error.message);
      }
    });
}