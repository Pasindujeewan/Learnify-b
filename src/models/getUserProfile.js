import pool from "../config/dbConfig.js";
import { AppError } from "../utils/AppError.js";

export const getUserProfile = async ({ user_id, role }) => {
  try {
    let query = "";
    console.log("user_id:", user_id);
    console.log("role:", role);

    if (role === "student") {
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
  

    -- Courses JSON (correctly mapped with status)
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
                    'image', c.image_url,
                    'status', e.status
                )
            )
            FROM enrollments e
            JOIN courses c ON e.course_id = c.course_id
            WHERE e.student_id = u.user_id
        ),
        '[]'
    ) AS courses
FROM users u
JOIN students s ON u.user_id = s.student_id
WHERE u.user_id = $1;
 `;
    } else if (role === "instructor") {
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
                    'image',c.image_url,
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
    console.log("Fetched user profile:", rows[0]);
    if (rows.length === 0) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    return rows[0];
  } catch (error) {
    console.error("Error fetching user profile:", error);

    if (error instanceof AppError) {
      throw error;
    }

    // Unknown error  wrap
    throw new AppError("Internal server error", 500, "GET_PROFILE_FAILED");
  }
};
