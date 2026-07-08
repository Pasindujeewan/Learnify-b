import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

export const createToken = ({ userId, userEmail, role }) => {
  if (!process.env.JWT_SECRET) {
    throw new AppError("Missing JWT secret", 500, "JWT_CONFIG_ERROR");
  }

  // Keep the token payload small; user profile data is loaded from /api/user/me.
  const token = jwt.sign({ userId, userEmail, role }, process.env.JWT_SECRET, {
    expiresIn: "10h",
  });
  return token;
};
