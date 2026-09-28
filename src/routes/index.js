import { Router } from "express";
import authRouter from "./auth.router.js";
import userRouter from "./user.router.js";
import imageRouter from "./image.router.js";
import commentRouter from "./comment.router.js";

const rootRouter = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/users", userRouter);
rootRouter.use("/images", imageRouter);
rootRouter.use("/comments", commentRouter);

export default rootRouter;

