import { findUserByEmail } from "../models/findUser.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { addUser } from "../models/userRegister.model.js";

export const registerUser = async (req, res) => {
  console.log("backend:reach");
  try {
    console.log("reach 0");
    const { name, email, password, avatar, role, description, contact } =
      req.body;
    // Validate input
    console.log("reach 1");
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
    console.log("reach 2");
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }
    console.log("reach 3");
    // Hash the password before saving to the database
    console.log("reach 4");
    const hashedPassword = await bcrypt.hash(password, 10);
    // Register the user in the database
    console.log("reach 5");
    const userID = await addUser({
      name,
      email,
      password: hashedPassword,
      avatar,
      role,
      description,
      contact,
    });
    console.log("reach 6");
    const token = jwt.sign({ userID, role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log("last ress");
    res.status(201).json({
      userID,
      token,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
