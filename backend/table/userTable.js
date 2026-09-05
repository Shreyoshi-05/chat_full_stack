import { Sequelize, DataTypes } from 'sequelize';
import { db } from '../db/db.js';

export const User = db.define(
  'User',
  {
    firstName: {
      type: DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true
    },
    name: {
      type: DataTypes.STRING,
      allowNull:false
    },
    phone:{
      type:DataTypes.STRING,
      allowNull:false
    },
    email:{
      type:DataTypes.STRING,
      allowNull:false
    },
    pass:{
      type:DataTypes.STRING,
      allowNull:false
    }
  },
);