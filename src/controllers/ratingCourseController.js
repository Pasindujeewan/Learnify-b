import { AppError } from "../utils/AppError.js";
import { rateCourseModel } from "../models/rateCourse.js";

export const rateCourseController = async (req, res) => {
  try {
    const { rating, comment, courseId } = req.body;
    const userId = req.user.userId;
    const ratingId = await rateCourseModel({
      rating,
      comment,
      courseId,
      userId,
    });
    res.status(201).json({ id: ratingId });
  } catch (e) {
    console.error("Error in rateCourseController:", e);
    throw new AppError("Failed to rate course", 500, "RATING_FAILED");
  }
};
