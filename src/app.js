import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();
// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the LMS API" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: "Server Error" });
});

export default app;
