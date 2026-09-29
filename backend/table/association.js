import { Group } from "./group.js";
import { GroupMember } from "./groupMem.js";
import { groupMessage } from "./groupMessage.js";
import { message } from "./messagesTable.js";
import { User } from "./userTable.js";


User.hasMany(message,{foreignKey:"senderId", as: "sendMessages"});

message.belongsTo(User, { foreignKey: 'senderId', as: "sender" });

User.hasMany(message, { foreignKey: 'receiverId' , as : "receivedMessages" });

message.belongsTo(User,{foreignKey:"receiverId" , as : "receiver"});


//group
Group.hasMany(GroupMember, { foreignKey: "groupId" });
GroupMember.belongsTo(Group, { foreignKey: "groupId" });

User.hasMany(GroupMember, { foreignKey: "userId" });
GroupMember.belongsTo(User, { foreignKey: "userId" });

Group.hasMany(groupMessage, { foreignKey: "groupId" });
groupMessage.belongsTo(Group, { foreignKey: "groupId" });

User.hasMany(groupMessage, { foreignKey: "senderId" });
groupMessage.belongsTo(User, { foreignKey: "senderId" });