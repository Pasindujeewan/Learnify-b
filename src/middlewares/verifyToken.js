import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new AppError("Not authenticated", 401, "NO_TOKEN"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return next(new AppError("Token invalid or expired", 401, "INVALID_TOKEN"));
  }
};
