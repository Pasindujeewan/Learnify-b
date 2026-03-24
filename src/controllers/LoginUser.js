import { findUserByEmail } from "../models/findUser.js";
import bcrypt from "bcryptjs";
import { createToken } from "../middlewares/createToken.js";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = createToken(user.user_id, user.email);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (e) {}
};
