import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define(
  "users",
  {
    user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    full_name: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.INTEGER },
    avatar: { type: DataTypes.STRING },
  },
  {
    tableName: "users",
    timestamps: false,
    defaultScope: { attributes: { exclude: ["password"] } },
    scopes: { withPassword: { attributes: { include: ["password"] } } },
  }
);

export default User;


