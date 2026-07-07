import { AppError } from "../utils/AppError.js";
import pool from "../config/dbConfig.js";
export const getCourseCommentsModel = async (courseId) => {
  try {
    const query = `select  r.comment as "comment", u.name as "studentName", u.avatar as "studentAvatar" ,r.id as "commentId" 
from courses_ratings r
join users u on r.student_id = u.user_id
where r.course_id=$1 `;
    const result = await pool.query(query, [courseId]);
    return result.rows;
  } catch (e) {
    throw new AppError(
      "Failed to get course ratings",
      500,
      "GET_RATINGS_FAILED",
    );
  }
};
