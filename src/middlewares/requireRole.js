import { AppError } from "../utils/AppError.js";

export const requireRole =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission for this action", 403, "FORBIDDEN"),
      );
    }

    next();
  };
