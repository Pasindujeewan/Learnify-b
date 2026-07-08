import pool from "../config/dbConfig.js";
import { AppError } from "../utils/AppError.js";

const COURSE_SELECT = `
  c.course_id,
  c.title,
  c.description,
  c.price,
  c.instructor_id AS "instructorId",
  c.image_url AS "imageUrl",
  c.category,
  c.level,
  c.duration,
  c.language,
  COALESCE(c.rating, 0) AS rating,
  c.created_at AS "createdAt",
  u.name AS "instructorName"
`;

export const getCourses = async ({ limit = 24, search = "", category = "" } = {}) => {
  const values = [];
  const where = [];

  // Build parameterized filters so search/category can be optional without SQL injection.
  if (search) {
    values.push(`%${search}%`);
    where.push(`(c.title ILIKE $${values.length} OR c.description ILIKE $${values.length})`);
  }

  if (category) {
    values.push(category);
    where.push(`c.category = $${values.length}`);
  }

  values.push(Number(limit) || 24);

  const query = `
    SELECT ${COURSE_SELECT},
      COUNT(e.student_id)::int AS "enrolledCount"
    FROM courses c
    JOIN users u ON c.instructor_id = u.user_id
    LEFT JOIN enrollments e ON e.course_id = c.course_id
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    GROUP BY c.course_id, u.name
    ORDER BY c.created_at DESC NULLS LAST, c.course_id DESC
    LIMIT $${values.length}
  `;

  const { rows } = await pool.query(query, values);
  return rows;
};

export const getCourseById = async (courseId) => {
  const { rows } = await pool.query(
    `
      SELECT ${COURSE_SELECT},
        COUNT(e.student_id)::int AS "enrolledCount"
      FROM courses c
      JOIN users u ON c.instructor_id = u.user_id
      LEFT JOIN enrollments e ON e.course_id = c.course_id
      WHERE c.course_id = $1
      GROUP BY c.course_id, u.name
    `,
    [courseId],
  );

  if (!rows[0]) {
    throw new AppError("Course not found", 404, "COURSE_NOT_FOUND");
  }

  return rows[0];
};

export const createCourse = async (courseData) => {
  const {
    title,
    description,
    price = 0,
    instructorId,
    imageUrl,
    category,
    level = "Beginner",
    duration = 1,
    language = "English",
  } = courseData;

  const { rows } = await pool.query(
    `
      INSERT INTO courses
        (title, description, price, instructor_id, image_url, category, level, duration, language)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING course_id, title, description, price, instructor_id AS "instructorId",
        image_url AS "imageUrl", category, level, duration, language, rating, created_at AS "createdAt"
    `,
    [title, description, price, instructorId, imageUrl, category, level, duration, language],
  );

  return rows[0];
};

export const getCourseWithStudents = async (courseId, instructorId = null) => {
  const values = [courseId];
  // When instructorId is passed, the query doubles as an ownership check.
  const ownerFilter = instructorId ? "AND c.instructor_id = $2" : "";

  if (instructorId) {
    values.push(instructorId);
  }

  const { rows } = await pool.query(
    `
      SELECT ${COURSE_SELECT},
        COALESCE(
          json_agg(
            jsonb_build_object(
              'userId', u2.user_id,
              'name', u2.name,
              'avatar', u2.avatar,
              'email', u2.email,
              'status', e.status
            )
          ) FILTER (WHERE u2.user_id IS NOT NULL),
          '[]'
        ) AS enrolledstudents
      FROM courses c
      JOIN users u ON c.instructor_id = u.user_id
      LEFT JOIN enrollments e ON e.course_id = c.course_id
      LEFT JOIN users u2 ON e.student_id = u2.user_id
      WHERE c.course_id = $1 ${ownerFilter}
      GROUP BY c.course_id, u.name
    `,
    values,
  );

  if (!rows[0]) {
    throw new AppError("Course not found", 404, "COURSE_NOT_FOUND");
  }

  return rows[0];
};

export const getCoursesByInstructor = async (instructorId) => {
  const { rows } = await pool.query(
    `
      SELECT ${COURSE_SELECT},
        COUNT(e.student_id)::int AS "enrolledStudents"
      FROM courses c
      JOIN users u ON c.instructor_id = u.user_id
      LEFT JOIN enrollments e ON e.course_id = c.course_id
      WHERE c.instructor_id = $1
      GROUP BY c.course_id, u.name
      ORDER BY c.created_at DESC NULLS LAST, c.course_id DESC
    `,
    [instructorId],
  );

  return rows;
};
