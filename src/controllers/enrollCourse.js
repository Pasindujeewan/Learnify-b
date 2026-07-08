import { AppError } from "../utils/AppError.js";
import { enrollCourseModel } from "../models/enrollCourse.js";
export const enrollCourse = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    // Students enroll as themselves; the user id always comes from verifyToken.
    const userId = req.user.userId;
    const enrollment = await enrollCourseModel({ courseId, userId });

    return res.status(201).json({
      success: true,
      message: "Enrolled successfully",
      data: enrollment,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    next(new AppError("Failed to enroll in course", 500, "ENROLLMENT_FAILED"));
  }
};
