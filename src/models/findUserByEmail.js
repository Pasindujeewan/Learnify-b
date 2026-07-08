import pool from "../config/dbConfig.js";
import { AppError } from "../utils/AppError.js";

export const findUserByEmail = async (email) => {
  try {
    // Parameterized lookup is used by login and registration duplicate checks.
    const { rows } = await pool.query(
      `SELECT user_id, name, email, password, avatar, role
       FROM users
       WHERE email = $1`,
      [email],
    );

    return rows[0];
  } catch (error) {
    throw new AppError("Database query failed", 500, "DB_QUERY_ERROR");
  }
};
