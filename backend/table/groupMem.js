import {  DataTypes } from "sequelize";
import { db } from "../db/db.js";

export const GroupMember = db.define("GroupMember", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  groupId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});
