import { findUserByEmail } from "../models/findUserByEmail.js";
import bcrypt from "bcryptjs";
import { createToken } from "../middlewares/createToken.js";
import { AppError } from "../utils/AppError.js";
//Login controller
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

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User Login successfully",
    });
  } catch (error) {
    next(new AppError("Error logging in user", 500, "LOGIN_FAILED"));
  }
};
