import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";
import { BadRequest } from "../common/app-error.js";

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads", { recursive: true });
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const fileName = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return cb(BadRequest("Only image files (jpg, png, gif, webp) are allowed"));
  }
  cb(null, true);
};


export const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter,
});

