import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const SavedImage = sequelize.define(
  "saved_images",
  {
    user_id: { type: DataTypes.INTEGER, primaryKey: true },
    image_id: { type: DataTypes.INTEGER, primaryKey: true },
    saved_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  { tableName: "saved_images", timestamps: false }
);

export default SavedImage;


