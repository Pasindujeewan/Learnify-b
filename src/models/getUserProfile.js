import pool from "../config/dbConfig.js";
import { AppError } from "../utils/AppError.js";

export const getUserProfile = async ({ user_id, role }) => {
  try {
    let query = "";

    if (role === "student") {
      // Student dashboards need the profile plus enrolled course summaries in one request.
      query = `
    SELECT
    u.user_id AS "userId",
    u.name,
    u.email,
    s.education_level,
    u.avatar,
    u.role,
    u.description,
    u.contact,
  

    COALESCE(
        (
            SELECT json_agg(
                jsonb_build_object(
                    'course_id', c.course_id,
                    'title', c.title,
                    'description', c.description,
                    'category', c.category,
                    'level', c.level,
                    'duration', c.duration,
                    'price', c.price,
                    'language', c.language,
                    'rating', c.rating,
                    'imageUrl', c.image_url,
                    'instructorName', instructor.name,
                    'status', e.status
                )
            )
            FROM enrollments e
            JOIN courses c ON e.course_id = c.course_id
            JOIN users instructor ON c.instructor_id = instructor.user_id
            WHERE e.student_id = u.user_id
        ),
        '[]'
    ) AS courses
FROM users u
JOIN students s ON u.user_id = s.student_id
WHERE u.user_id = $1;
 `;
    } else if (role === "instructor") {
      // Instructor dashboards include all owned courses so the frontend can render quickly.
      query = `
    SELECT 
    u.user_id AS "userId",
    u.name,
    u.email,
    u.avatar,
    u.role,
    u.description,
    u.contact,
    

    i.rating,
    i.experience,
    i.expertise,

    COALESCE(
        (
            SELECT json_agg(
                jsonb_build_object(
                    'course_id', c.course_id,
                    'title', c.title,
                    'description', c.description,
                    'category', c.category,
                    'level', c.level,
                    'duration', c.duration,
                    'price', c.price,
                    'language', c.language,
                    'rating', c.rating,
                    'imageUrl', c.image_url,
                    'createdAt', c.created_at
                )
            )
            FROM courses c
            WHERE c.instructor_id = i.instructor_id
        ),
        '[]'
    ) AS courses

FROM users u
JOIN instructors i 
    ON u.user_id = i.instructor_id
WHERE u.user_id = $1; `;
    } else {
      throw new AppError("Invalid role", 400, "INVALID_ROLE");
    }

    const { rows } = await pool.query(query, [user_id]);
    if (rows.length === 0) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    return rows[0];
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Internal server error", 500, "GET_PROFILE_FAILED");
  }
};
