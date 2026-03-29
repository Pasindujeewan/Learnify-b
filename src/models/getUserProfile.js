import pool from "../config/dbConfig.js";
import { AppError } from "../utils/AppError.js";

export const getUserProfile = async (user_id, role) => {
  try {
    let query = "";

    if (role === "student") {
      query = `
        SELECT u.*, s.*
        FROM users u
        JOIN student s ON u.user_id = s.user_id
        WHERE u.user_id = $1
      `;
    } else if (role === "instructor") {
      query = `
        SELECT u.*, i.*
        FROM users u
        JOIN instructor i ON u.user_id = i.user_id
        WHERE u.user_id = $1
      `;
    } else {
      throw new AppError("Invalid role", 400, "INVALID_ROLE");
    }

    const { rows } = await pool.query(query, [user_id]);

    if (rows.length === 0) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    return {
      success: true,
      message: "User profile fetched successfully",
      data: rows[0],
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);

    // If already AppError  rethrow
    if (error instanceof AppError) {
      throw error;
    }

    // Unknown error  wrap
    throw new AppError("Internal server error", 500, "GET_PROFILE_FAILED");
  }
};
