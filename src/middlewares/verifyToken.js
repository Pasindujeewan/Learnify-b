import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

export const verifyToken = (req, res, next) => {
  if (!process.env.JWT_SECRET) {
    return next(new AppError("Missing JWT secret", 500, "JWT_CONFIG_ERROR"));
  }

  // Support both browser cookie auth and Bearer tokens for API clients.
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new AppError("Not authenticated", 401, "NO_TOKEN"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Controllers read req.user for ownership checks and role-based behavior.
    req.user = decoded;
    next();
  } catch {
    return next(new AppError("Token invalid or expired", 401, "INVALID_TOKEN"));
  }
};
