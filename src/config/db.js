import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
  user: "postgres.eksoqhjhwhgehdmnhnmf", // ✅ correct
  password: "Sadun20031120?", // ✅ raw password OK here
  host: "aws-1-ap-northeast-2.pooler.supabase.com",
  port: 6543,
  database: "postgres",
  ssl: {
    rejectUnauthorized: false,
  },
  family: 4,
});

export default pool;
