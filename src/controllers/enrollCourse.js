import { AppError } from "../utils/AppError.js";
import { enrollCourseModel } from "../models/enrollCourse.js";
export const enrollCourse = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user.userId;
    const enrollment = await enrollCourseModel({ courseId, userId });

    return res.status(201).json({
      success: true,
      message: "Enrolled successfully",
      data: enrollment,
    });
  } catch (error) {
    next(new AppError("Failed to enroll in course", 500, "ERROR_OCCURED"));
  }
};
