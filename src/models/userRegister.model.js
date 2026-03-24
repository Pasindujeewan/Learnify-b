import pool from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();
export const addUser = async (data) => {
  // Use a single client for the entire transaction to ensure atomicity
  console.log("models");
  const client = await pool.connect();
  try {
    // Destructure user data
    const { name, email, password, avatar, role, description, contact } = data;
    const query = `INSERT INTO users (name, email, password, avatar, role, description, contact) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING user_id`;
    const values = [name, email, password, avatar, role, description, contact];
    // Start a transaction
    await client.query("BEGIN");
    // Insert user and get the generated user_id
    const userResult = await client.query(query, values);
    const userId = userResult.rows[0].user_id;
    const userEmail = userResult.rows[0].email;
    // Insert into role-specific table based on the user's role
    if (role === "instructor") {
      const instructorQuery = `INSERT INTO instructors (instructor_id) VALUES ($1)`;
      await client.query(instructorQuery, [userId]);
    }
    if (role === "student") {
      const studentQuery = `INSERT INTO students (student_id) VALUES ($1)`;
      await client.query(studentQuery, [userId]);
    }
    // Commit the transaction
    await client.query("COMMIT");
    return { userId, userEmail };
  } catch (error) {
    // Rollback the transaction in case of any error
    console.error("Error registering user:", error);
    await client.query("ROLLBACK");
    throw error;
  } finally {
    // Release the client back to the pool
    client.release();
  }
};
