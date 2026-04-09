import { AppError } from "../utils/AppError.js";
import pool from "../config/dbConfig.js";
export const enrollCourseModel = async ({ courseId, userId }) => {
  try {
    console.log(`Enrolling user here model ${userId} to course ${courseId}`);
    const query =
      "INSERT INTO enrollments (course_id, student_id) VALUES ($1, $2) RETURNING *";
    const values = [courseId, userId];
    const { rows } = await pool.query(query, values);
    if (rows.length === 0) {
      throw new AppError("Enrollment failed", 400, "ENROLLMENT_FAILED");
    }
    return rows[0];
  } catch (error) {
    console.error("Error enrolling in course:", error);
    throw new AppError("Failed to enroll in course", 500, "ERROR_OCCURED");
  }
};
