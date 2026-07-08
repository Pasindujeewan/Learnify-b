import { findUserByEmail } from "../models/findUserByEmail.js";
import bcrypt from "bcryptjs";
import { registerUserModel } from "../models/userRegister.model.js";
import { createToken } from "../middlewares/createToken.js";
import { AppError } from "../utils/AppError.js";

export const registerUserController = async (req, res, next) => {
  try {
    const { name, email, password, avatar, role, description, contact } =
      req.body;

    if (!name || !email || !password || !role) {
      return next(
        new AppError("Some credentials are empty", 400, "EMPTY_CREDENTIALS"),
      );
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return next(
        new AppError("User already exists", 409, "USER_ALREADY_EXISTS"),
      );
    }

    // Store only the hashed password; the raw password never leaves this request.
    const hashedPassword = await bcrypt.hash(password, 10);

    // User creation also creates the matching student/instructor profile row.
    const { userId, userEmail, userRole } = await registerUserModel({
      name,
      email,
      password: hashedPassword,
      avatar,
      role,
      description,
      contact,
    });

    const token = createToken({
      userId: userId,
      userEmail: userEmail,
      role: userRole,
    });

    // The frontend authenticates future requests through this HTTP-only cookie.
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        userId,
        email: userEmail,
        role: userRole,
        name,
        avatar,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    next(new AppError("Error registering user", 500, "REGISTER_FAILED"));
  }
};
