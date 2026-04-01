import { getUserProfile } from "../models/getUserProfile.js";
import redis from "../config/redisConfig.js";
import { AppError } from "../utils/AppError.js";

export const getUserController = async (req, res, next) => {
  const userId = req.user.userId;
  const userRole = req.user.role;
  try {
    const cachedUser = await redis.get(`user:${userId}`);
    /*if (cachedUser) {
      console.log("User data retrieved from cache");
      return res.status(200).json({
        success: "success",
        user: JSON.parse(cachedUser),
      });
    }*/
    const user = await getUserProfile(userId, userRole);
    /*
    await redis.set(`user:${userId}`, JSON.stringify(user), {
      EX: 120, // cache for 2 minutes
    });*/
    console.log("User data retrieved from database and cached");
    return res.status(200).json({
      success: "success",
      user: user,
      role: userRole,
    });
  } catch (e) {
    next(new AppError("Error fetching user data", 500, "FETCH_USER_FAILED"));
  }
};
