import { AppError } from "../utils/AppError.js";
import { rateCourseModel } from "../models/rateCourse.js";

export const rateCourseController = async (req, res, next) => {
  try {
    const { rating, comment, courseId } = req.body;
    const userId = req.user.userId;

    if (!courseId || !rating || Number(rating) < 1 || Number(rating) > 5) {
      return next(
        new AppError("Course and a rating from 1 to 5 are required", 400, "INVALID_RATING"),
      );
    }

    const ratingId = await rateCourseModel({
      rating: Number(rating),
      comment,
      courseId,
      userId,
    });

    res.status(201).json({
      success: true,
      data: { id: ratingId },
    });
  } catch (e) {
    next(new AppError("Failed to rate course", 500, "RATING_FAILED"));
  }
};
