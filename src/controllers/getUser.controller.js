import { getUserProfile } from "../models/getUserProfile.js";
import { AppError } from "../utils/AppError.js";

export const getUserController = async (req, res, next) => {
  const userId = req.user.userId;
  const userRole = req.user.role;

  try {
    const user = await getUserProfile({ user_id: userId, role: userRole });

    return res.status(200).json({
      success: true,
      user,
      role: userRole,
    });
  } catch (e) {
    next(new AppError("Error fetching user data", 500, "FETCH_USER_FAILED"));
  }
};
