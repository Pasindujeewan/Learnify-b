import express from "express";
import cors from "cors";
import helmet from "helmet";
import pool from "./config/dbConfig.js";
import uploadRoutes from "./routes/upload.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRouter from "./routes/protected.routes.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.js";
import { AppError } from "./utils/AppError.js";
const app = express();

// Middleware

app.use(
  cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:5173"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the LMS API" });
});
console.log("Starting server and checking DB connection...");
async function checkDbConnection() {
  try {
    console.log("Checking database connection...");
    const res = await pool.query("SELECT NOW()");
    console.log("DB Connected at:", res.rows[0].now);
  } catch (err) {
    console.error("DB Connection Failed:", err.message);
    process.exit(1);
  }
}
checkDbConnection();
console.log("DB connection successful, starting server...");
app.use("/api/upload", uploadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRouter);

app.use((req, res, next) => {
  next(new AppError("Route not found", 404, "NOT_FOUND"));
});

app.use(errorHandler);

export default app;
