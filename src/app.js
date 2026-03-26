import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import pool from "./config/db.js";
dotenv.config();
import uploadRoutes from "./routes/upload.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRouter from "./routes/protected.routes.js";
import cookieParser from "cookie-parser";

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
async function checkDbConnection() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("DB Connected at:", res.rows[0].now);
  } catch (err) {
    console.error("DB Connection Failed:", err.message);
    process.exit(1); // stop app if DB fails (important)
  }
}
checkDbConnection();

app.use("/api/upload", uploadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: "Server Error" });
});

export default app;
