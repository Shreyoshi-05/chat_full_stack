import { DataTypes } from 'sequelize';
import {db} from "../db/db.js"

export const message = db.define(
  'message',
  {
    id:{
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    message:{
      type:DataTypes.STRING,
      allowNull:false
    }
  },
);