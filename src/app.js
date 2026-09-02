import express from "express";
import cors from "cors";
import helmet from "helmet";
import uploadRoutes from "./routes/upload.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRouter from "./routes/protected.routes.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.js";
import { AppError } from "./utils/AppError.js";
import courseRouter from "./routes/course.routes.js";
import studentRouter from "./routes/student.routes.js";
import instructorRouter from "./routes/instructor.routes.js";

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Global middleware applies before every API route.

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(helmet());
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

// Keep the root endpoint lightweight for API health checks.
app.get("/", (req, res) => {
  res.json({
    message: "Learnify LMS API",
    status: "online",
  });
});

app.use("/api/upload", uploadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRouter);
app.use("/api/courses", courseRouter);
app.use("/api/students", studentRouter);
app.use("/api/instructors", instructorRouter);

// Convert unknown URLs into the same JSON error shape as the rest of the API.
app.use((req, res, next) => {
  next(new AppError("Route not found", 404, "NOT_FOUND"));
});

app.use(errorHandler);

export default app;
