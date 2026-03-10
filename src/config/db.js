import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: "lms_db" || process.env.DB_NAME,
  password: "pasindu" || process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export default pool;
