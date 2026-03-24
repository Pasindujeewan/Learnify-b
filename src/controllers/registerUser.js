import { findUserByEmail } from "../models/findUser.js";
import bcrypt from "bcryptjs";
import { addUser } from "../models/userRegister.model.js";
import { createToken } from "../middlewares/createToken.js";
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, avatar, role, description, contact } =
      req.body;
    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }
    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);
    // Register the user in the database
    const { userID, userEmail } = await addUser({
      name,
      email,
      password: hashedPassword,
      avatar,
      role,
      description,
      contact,
    });
    const token = createToken({ userID, userEmail });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      userID,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
