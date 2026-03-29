import { Pool } from "pg";
import { AppError } from "../utils/AppError.js";
import dotenv from "dotenv";
dotenv.config();

const requiredEnv = ["DB_USER", "DB_PASSWORD", "DB_HOST", "DB_PORT", "DB_NAME"];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new AppError(`Missing env variable: ${key}`, 500, "DB_CONFIG_ERROR");
  }
});

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,

  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,

  family: 4,
});

export default pool;
