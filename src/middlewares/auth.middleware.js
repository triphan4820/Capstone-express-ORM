import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import { Unauthorized } from "../common/app-error.js";

const extractBearerToken = (authorizationHeader) => {
  const [type, token] = (authorizationHeader || "").split(" ");
  if (type !== "Bearer" || !token) {
    throw Unauthorized("Authentication token missing");
  }
  return token;
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw Unauthorized("Token has expired, please log in again");
    }
    throw Unauthorized("Invalid token");
  }
};

export const protect = async (req, res, next) => {
  const token = extractBearerToken(req.headers.authorization);
  const payload = verifyToken(token);

  const user = await User.findByPk(payload.user_id);
  if (!user) throw Unauthorized("User account no longer exists");

  req.user = user.toJSON();
  next();
};




