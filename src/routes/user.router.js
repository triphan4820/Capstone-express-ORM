import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../config/upload.js";

const userRouter = Router();

userRouter.use(protect);

userRouter.get("/me", userController.getMe);
userRouter.get("/:id/saved-images", userController.getSavedImages);
userRouter.get("/:id/created-images", userController.getCreatedImages);
userRouter.put("/me", (req, res, next) => {
  upload.single("avatar")(req, res, (err) => {
    if (err && err.code === "LIMIT_UNEXPECTED_FILE") {
      return upload.single("anh_dai_dien")(req, res, next);
    }
    if (err) return next(err);
    next();
  });
}, userController.updateMe);

export default userRouter;


