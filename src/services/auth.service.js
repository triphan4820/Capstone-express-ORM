import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import { BadRequest, Conflict, Unauthorized } from "../common/app-error.js";
import { isEmail, requireString, parseAge } from "../common/validate.js";

const normalizeEmail = (value) => (typeof value === "string" ? value.trim().toLowerCase() : "");

const validatePassword = (value) => {
  if (typeof value !== "string" || value.length < 6) {
    throw BadRequest("Password must be at least 6 characters long");
  }
  return value;
};

const sanitizeUser = (user) => {
  const { password: _, ...userWithoutPassword } = user.toJSON();
  return userWithoutPassword;
};

const buildToken = (userId) =>
  jwt.sign(
    { user_id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );

const authService = {
  register: async (body) => {
    const email = body.email;
    const password = body.password ?? body.mat_khau;
    const fullNameRaw = body.full_name ?? body.ho_ten;
    const ageRaw = body.age ?? body.tuoi;

    if (!isEmail(email)) throw BadRequest("Invalid email address");
    validatePassword(password);
    const fullName = requireString(fullNameRaw, "Full name (full_name)");
    const age = parseAge(ageRaw);
    const normalizedEmail = normalizeEmail(email);

    const isExist = await User.findOne({ where: { email: normalizedEmail } });
    if (isExist) throw Conflict("Email already registered");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
      full_name: fullName,
      age,
    });

    return sanitizeUser(newUser);
  },

  login: async (body) => {
    const email = body.email;
    const password = body.password ?? body.mat_khau;
    const normalizedEmail = normalizeEmail(email);

    if (!isEmail(normalizedEmail) || typeof password !== "string" || password === "") {
      throw BadRequest("Please provide a valid email and password");
    }

    const user = await User.scope("withPassword").findOne({
      where: { email: normalizedEmail },
    });

    if (!user) throw Unauthorized("Invalid email or password");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw Unauthorized("Invalid email or password");

    const token = buildToken(user.user_id);

    return { token, user: sanitizeUser(user) };
  },
};

export default authService;




