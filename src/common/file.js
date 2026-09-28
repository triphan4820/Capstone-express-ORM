import fs from "fs/promises";
import path from "path";

export const buildFileUrl = (req, filename) => `${req.protocol}://${req.get("host")}/uploads/${filename}`;

const isServerUploadPath = (value) => typeof value === "string" && value.includes("/uploads/");

export const removeUploadedFile = async (urlOrPath) => {
  if (!isServerUploadPath(urlOrPath)) return;

  const filename = path.basename(urlOrPath);
  await fs.unlink(path.join("uploads", filename)).catch(() => {});
};

