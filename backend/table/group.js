import {  DataTypes } from "sequelize";
import { db } from "../db/db.js";

export const Group = db.define("Group", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  adminId: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});
