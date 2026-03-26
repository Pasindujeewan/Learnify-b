import pool from "../config/db.js";
export const findUserByEmail = async (email) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (rows.length === 0) {
      console.error("no such user found");
    }
    return rows[0];
  } catch (error) {
    console.error("Error finding user:", error);
    throw error;
  }
};
