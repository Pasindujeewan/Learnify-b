import { getFullCourseModel } from "../models/getFullCourse.js";
import { AppError } from "../utils/AppError.js";
export const getFullCourseController = async (req, res, next) => {
  try {
    if (req.user.role !== "instructor") {
      return next(new AppError("Unauthorized access", 403, "UNAUTHORIZED"));
    }
    const courseId = req.params.courseId;
    const courseDetails = await getFullCourseModel(courseId);
    return res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (error) {
    console.error("Error in getFullCourseController:", error);
    next(error);
  }
};
