import "dotenv/config";
import express from "express";
import cors from "cors";
import { sequelize } from "./models/index.js";
import rootRouter from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";

const app = express();
const PORT = process.env.PORT || 3001;

const configureApp = () => {
  app.use(cors());
  app.use(express.json());
  app.use("/uploads", express.static("uploads"));

  app.get("/", (req, res) => res.json({ message: "ExpressJS_ORM API is running 🚀" }));
  app.use("/api", rootRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);
};

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");
    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
  } catch (err) {
    console.error("❌ Failed to connect to database:", err.message);
    process.exit(1);
  }
};


configureApp();
startServer();
