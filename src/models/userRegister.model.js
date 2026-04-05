import pool from "../config/dbConfig.js";
import dotenv from "dotenv";
import { AppError } from "../utils/AppError.js";

dotenv.config();

export const registerUserModel = async (data) => {
  const client = await pool.connect();

  try {
    const { name, email, password, avatar, role, description, contact } = data;

    const query = `
      INSERT INTO users (name, email, password, avatar, role, description, contact) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING user_id, email, role
    `;

    const values = [name, email, password, avatar, role, description, contact];

    await client.query("BEGIN");

    const userResult = await client.query(query, values);

    const userId = userResult.rows[0].user_id;
    const userEmail = userResult.rows[0].email;
    const userRole = userResult.rows[0].role;
    console.log("Registered user ID:", userId);
    console.log("Registered user Email:", userEmail);
    console.log("Registered user Role:", userRole);

    if (role === "instructor") {
      const instructorQuery = `INSERT INTO instructors (instructor_id) VALUES ($1) RETURNING instructor_id`;
      const instructorResult = await client.query(instructorQuery, [userId]);
    }

    if (role === "student") {
      const studentQuery = `INSERT INTO students (student_id) VALUES ($1) RETURNING student_id`;
      const studentResult = await client.query(studentQuery, [userId]);
    }

    await client.query("COMMIT");

    return { userId, userEmail, userRole };
  } catch (error) {
    console.error("Error registering user: here ", error);

    await client.query("ROLLBACK");

    // If already AppError → rethrow
    if (error instanceof AppError) {
      throw error;
    }

    // Wrap unknown DB errors
    throw new AppError("User registration failed", 500, "USER_CREATION_FAILED");
  } finally {
    client.release();
  }
};
