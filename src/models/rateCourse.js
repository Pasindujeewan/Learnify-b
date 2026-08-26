import { AppError } from "../utils/AppError.js";
import pool from "../config/dbConfig.js";
export const rateCourseModel = async ({
  rating,
  comment,
  courseId,
  userId,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Each student can keep one review per course; submitting again updates it.
    const ratingQuery = `
        INSERT INTO courses_ratings
            (course_id, student_id, rating, comment)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (course_id, student_id)
        DO UPDATE SET
            rating = EXCLUDED.rating,
            comment = EXCLUDED.comment
        RETURNING id;
    `;

    const result = await client.query(ratingQuery, [
      courseId,
      userId,
      rating,
      comment,
    ]);
    if (result.rows.length === 0) {
      throw new AppError("Failed to rate course", 500, "RATING_FAILED");
    }
    // Update the course's average rating after the new rating is inserted or updated.
    const updateCourseQuery = `
        UPDATE courses
        SET rating = (
            SELECT COALESCE(ROUND(AVG(rating), 2), 0)
            FROM courses_ratings
            WHERE course_id = $1
        )
        WHERE course_id = $1;
    `;

    const updateResult = await client.query(updateCourseQuery, [courseId]);

    if (updateResult.rowCount === 0) {
      throw new AppError(
        "Failed to update course rating",
        500,
        "RATING_UPDATE_FAILED",
      );
    }
    //Everything succeeded
    await client.query("COMMIT");

    return result.rows[0].id;
  } catch (e) {
    console.error("Error in rateCourseModel:", e);
    await client.query("ROLLBACK");

    throw new AppError("Failed to rate course", 500, "RATING_FAILED");
  } finally {
    client.release();
  }
};
