import { findUserByEmail } from "../models/findUserByEmail.js";
import bcrypt from "bcryptjs";
import { registerUserModel } from "../models/userRegister.model.js";
import { createToken } from "../middlewares/createToken.js";
import { AppError } from "../utils/AppError.js";

export const registerUserController = async (req, res, next) => {
  try {
    const { name, email, password, avatar, role, description, contact } =
      req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return next(
        new AppError("Some credentials are empty", 400, "EMPTY_CREDENTIALS"),
      );
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return next(
        new AppError("user already exsist", 409, "USER_ALREADY_EXSIST"),
      );
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Register the user in the database
    const { userID, userEmail, Userrole } = await registerUserModel({
      name,
      email,
      password: hashedPassword,
      avatar,
      role,
      description,
      contact,
    });

    const token = createToken({ userID, userEmail, Userrole });

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
    next(new AppError("Error registering user", 500, "REGISTER_FAILED"));
  }
};
