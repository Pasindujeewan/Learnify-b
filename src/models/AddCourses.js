import pool from "../config/dbConfig.js";
import { AppError } from "../utils/AppError.js";
export const addCourse = async (courseData) => {
  try {
    const {
      title,
      description,
      price,
      instructorId,
      imageUrl,
      category,
      duration,
    } = courseData;

    const query = `
        INSERT INTO courses (title, description, price, instructor_id, image_url, category, duration) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING course_id
    `;
    const values = [
      title,
      description,
      price,
      instructorId,
      imageUrl,
      category,
      duration,
    ];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      throw new AppError(
        "Course creation failed",
        "COURSE_CREATION_FAILED",
        500,
      );
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error adding course:", error);
    throw new AppError("Failed to add course", "SOME_ERROR_OCCURRED", 500);
  }
};
