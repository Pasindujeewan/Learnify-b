import pool from "../config/dbConfig.js";
import { AppError } from "../utils/AppError.js";
export const getCoursesModel = async (limit) => {
  try {
    const data = await pool.query(
      `SELECT c.*, u.name AS instructorName
FROM courses c
JOIN users u
ON c.instructor_id = u.user_id LIMIT $1`,
      [limit],
    );
    if (data.rows.length === 0) {
      throw new AppError("No courses found", 404, "COURSE_NOT_FOUND");
    }
    return data.rows;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw new AppError("Failed to fetch courses", 500, "COURSE_FETCH_ERROR");
  }
};
