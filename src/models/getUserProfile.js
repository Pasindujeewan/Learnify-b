import pool from "../config/dbConfig.js";
import { AppError } from "../utils/AppError.js";

export const getUserProfile = async (user_id, role) => {
  try {
    let query = "";

    if (role === "student") {
      query = `
    SELECT  
    u.user_id AS "userId", 
    u.name,
    u.email,
    s.theme,
    u.avatar,
    u.role,
    u.description,
    u.contact,
    u.created_at,

    -- Courses JSON
    COALESCE(
        json_agg(
            DISTINCT jsonb_build_object(
                'course_id', c.course_id,
                'title', c.title,
                'description', c.description,
                'category', c.category,
                'level', c.level,
                'duration', c.duration,
                'price', c.price,
                'language', c.language,
                'rating', c.rating,
                'image', c.image
            )
        ) FILTER (WHERE c.course_id IS NOT NULL),
        '[]'
    ) AS courses
FROM users u
JOIN students s 
    ON u.user_id = s.student_id
LEFT JOIN enrollments e 
    ON u.user_id = e.student_id
LEFT JOIN courses c 
    ON e.course_id = c.course_id
WHERE u.user_id = $1
GROUP BY 
    u.user_id, u.name, u.email, s.theme;

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
    u.created_at,

    i.instructor_id,
    i.rating,
    i.experience,
    i.expertise,

    COALESCE(
        json_agg(
            json_build_object(
                'course_id', c.course_id,
                'title', c.title,
                'description', c.description,
                'category', c.category,
                'level', c.level,
                'duration', c.duration,
                'price', c.price,
                'language', c.language,
                'rating', c.rating,
                'image', c.image
            )
        ) FILTER (WHERE c.course_id IS NOT NULL),
        '[]'
    ) AS courses
FROM users u
JOIN instructors i 
    ON u.user_id = i.instructor_id
LEFT JOIN courses c 
    ON c.instructor_id = i.instructor_id
WHERE u.user_id = $1
    GROUP BY 
    u.user_id,
    i.instructor_id;
      `;
    } else {
      throw new AppError("Invalid role", 400, "INVALID_ROLE");
    }

    const { rows } = await pool.query(query, [user_id]);

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
