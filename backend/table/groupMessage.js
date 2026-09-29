import {  DataTypes } from "sequelize";
import { db } from "../db/db.js";

export const groupMessage = db.define("groupMessage", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  groupId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  senderId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  text:{
    type:DataTypes.STRING,
    allowNull:false
  }
});
