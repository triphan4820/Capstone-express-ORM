import multer from "multer";
import { AppError } from "../common/app-error.js";

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    statusCode: 404,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
    data: null,
  });
};

export const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ statusCode: err.statusCode, message: err.message, data: null });
  }

  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE" ? "Image file must be under 25MB"
      : err.code === "LIMIT_UNEXPECTED_FILE" ? `Unexpected field name: "${err.field}"`
      : `File upload error: ${err.message}`;
    return res.status(400).json({ statusCode: 400, message, data: null });
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ statusCode: 400, message: "Invalid JSON payload", data: null });
  }

  console.error(err);
  return res.status(500).json({ statusCode: 500, message: "Internal server error, please try again later", data: null });
};


