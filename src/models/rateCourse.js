import { AppError } from "../utils/AppError.js";
import pool from "../config/dbConfig.js";
export const rateCourseModel = async ({
  rating,
  comment,
  courseId,
  userId,
}) => {
  try {
    const query = `INSERT INTO courses_ratings (course_id, student_id, rating, comment)
VALUES ($1, $2, $3, $4)
ON CONFLICT (course_id, student_id)
DO UPDATE SET
  rating = EXCLUDED.rating,
  comment = EXCLUDED.comment
  RETURNING id;`;
    const result = await pool.query(query, [courseId, userId, rating, comment]);
    if (result.rows.length === 0) {
      throw new AppError("Failed to rate course", 500, "RATING_FAILED");
    }
    return result.rows[0].id;
  } catch (e) {
    console.error("Error in rateCourseModel:", e);
    throw new AppError("Failed to rate course", 500, "RATING_FAILED");
  }
};
