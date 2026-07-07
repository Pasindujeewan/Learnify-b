import { AppError } from "../utils/AppError.js";
import pool from "../config/dbConfig.js";
export const enrollCourseModel = async ({ courseId, userId }) => {
  try {
    const { rows } = await pool.query(
      `
        INSERT INTO enrollments (course_id, student_id, status)
        VALUES ($1, $2, 'in-progress')
        ON CONFLICT (course_id, student_id)
        DO UPDATE SET status = enrollments.status
        RETURNING *
      `,
      [courseId, userId],
    );

    return rows[0];
  } catch (error) {
    throw new AppError("Failed to enroll in course", 500, "ERROR_OCCURED");
  }
};
