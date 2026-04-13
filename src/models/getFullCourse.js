import pool from "../config/dbConfig.js";
import { AppError } from "../utils/AppError.js";

export const getFullCourseModel = async (courseId) => {
  try {
    const query = `SELECT 
  c.*,
  COALESCE(
    (
      SELECT json_agg(
        jsonb_build_object(
          'userId', u.user_id,
          'name', u.name,
          'avatar', u.avatar,
          'email', u.email
        )
      )
      FROM enrollments e
      JOIN users u ON e.student_id = u.user_id
      WHERE e.course_id = c.course_id
    ),
    '[]'
  ) AS enrolledstudents

FROM courses c
WHERE c.course_id = $1;`;
    const { rows } = await pool.query(query, [courseId]);
    if (rows.length === 0) {
      throw new AppError("Course not found", 404, "COURSE_NOT_FOUND");
    }
    return rows[0];
  } catch (error) {
    console.error("Error fetching course details:", error);
    throw new AppError(
      "Failed to fetch course details",
      500,
      "COURSE_FETCH_ERROR",
    );
  }
};
