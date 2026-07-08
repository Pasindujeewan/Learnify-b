import { getCourseCommentsModel } from "../models/getCourseComments.js";
import { AppError } from "../utils/AppError.js";
export const getCourseCommentsController = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    // Reviews are read-only here so course pages can show social proof to guests.
    const comments = await getCourseCommentsModel(courseId);
    return res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (e) {
    next(new AppError("Unable to load course comments", 500, "SERVER_ERROR"));
  }
};
