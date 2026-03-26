import { findUserByEmail } from "../models/findUser.js";
import bcrypt from "bcryptjs";
import { createToken } from "../middlewares/createToken.js";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        code: "EMPTY_CREDENTIALS",
        message: "Some credentials are empty ",
      });
    }
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        code: "USER_NOT_FOUND",
        message: "canot find user ",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        code: "INVALID_PASSWORD",
        message: "password is incorrect ",
      });
    }
    const token = createToken({ userId: user.user_id, userEmail: user.email });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({
      success: false,
      code: "SERVER_ERROR",
      message: "something going wrong in server",
    });
  }
};
