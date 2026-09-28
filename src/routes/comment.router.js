import { Router } from "express";
import commentController from "../controllers/comment.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const commentRouter = Router();

commentRouter.use(protect);
commentRouter.delete("/:id", commentController.deleteComment);

export default commentRouter;
