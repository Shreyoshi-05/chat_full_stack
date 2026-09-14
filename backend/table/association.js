import { message } from "./messagesTable.js";
import { User } from "./userTable.js";


User.hasMany(message,{foreignKey:"senderId", as: "sendMessages"});

message.belongsTo(User, { foreignKey: 'senderId', as: "sender" });

User.hasMany(message, { foreignKey: 'receiverId' , as : "receivedMessages" });

message.belongsTo(User,{foreignKey:"receiverId" , as : "receiver"});