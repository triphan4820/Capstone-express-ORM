import sequelize from "../config/database.js";
import User from "./user.model.js";
import Image from "./image.model.js";
import Comment from "./comment.model.js";
import SavedImage from "./savedImage.model.js";

User.hasMany(Image, { foreignKey: "user_id", as: "created_images" });
Image.belongsTo(User, { foreignKey: "user_id", as: "creator" });

User.hasMany(Comment, { foreignKey: "user_id", as: "comments" });
Comment.belongsTo(User, { foreignKey: "user_id", as: "commenter" });
Image.hasMany(Comment, { foreignKey: "image_id", as: "comments" });
Comment.belongsTo(Image, { foreignKey: "image_id", as: "image" });

User.hasMany(SavedImage, { foreignKey: "user_id", as: "saved_images" });
SavedImage.belongsTo(User, { foreignKey: "user_id", as: "user" });
Image.hasMany(SavedImage, { foreignKey: "image_id", as: "saved_images" });
SavedImage.belongsTo(Image, { foreignKey: "image_id", as: "image" });

export { sequelize, User, Image, Comment, SavedImage };


