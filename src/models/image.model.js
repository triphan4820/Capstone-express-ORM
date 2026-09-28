import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Image = sequelize.define(
  "images",
  {
    image_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    image_name: { type: DataTypes.STRING, allowNull: false },
    image_url: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  { tableName: "images", timestamps: false }
);

export default Image;


