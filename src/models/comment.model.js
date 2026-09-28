import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Comment = sequelize.define(
  "comments",
  {
    comment_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    image_id: { type: DataTypes.INTEGER, allowNull: false },
    comment_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    content: { type: DataTypes.STRING, allowNull: false },
  },
  { tableName: "comments", timestamps: false }
);

export default Comment;


