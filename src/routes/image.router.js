import { Router } from "express";
import imageController from "../controllers/image.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../config/upload.js";

const imageRouter = Router();

imageRouter.use(protect);

imageRouter.get("/", imageController.getImages);
imageRouter.get("/search", imageController.searchImages);
imageRouter.get("/:id", imageController.getImageDetail);
imageRouter.get("/:id/comments", imageController.getComments);
imageRouter.post("/:id/comments", imageController.addComment);
imageRouter.get("/:id/saved", imageController.checkSaved);
imageRouter.post("/", (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err && err.code === "LIMIT_UNEXPECTED_FILE") {
      return upload.single("hinh_anh")(req, res, next);
    }
    if (err) return next(err);
    next();
  });
}, imageController.createImage);

imageRouter.delete("/:id", imageController.deleteImage);
imageRouter.post("/:id/save", imageController.saveImage);
imageRouter.delete("/:id/save", imageController.unsaveImage);

export default imageRouter;


