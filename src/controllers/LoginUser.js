import { findUserByEmail } from "../models/findUserByEmail.js";
import bcrypt from "bcryptjs";
import { createToken } from "../middlewares/createToken.js";
import { AppError } from "../utils/AppError.js";
export const loginUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(
        new AppError("Some credentials are empty", 400, "EMPTY_CREDENTIALS"),
      );
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return next(new AppError("Cannot find user", 401, "USER_NOT_FOUND"));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(
        new AppError("Password is incorrect", 401, "INVALID_PASSWORD"),
      );
    }

    const token = createToken({
      userId: user.user_id,
      userEmail: user.email,
      role: user.role,
    });

    // Keep JWT out of localStorage to reduce exposure to client-side scripts.
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        userId: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    next(new AppError("Error logging in user", 500, "LOGIN_FAILED"));
  }
};

export const logoutUserController = (req, res) => {
  // Clearing the token cookie is enough because auth is cookie/JWT based.
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};
