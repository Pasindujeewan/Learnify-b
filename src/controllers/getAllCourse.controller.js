import { getCoursesModel } from "../models/getCourses.model.js";
import { AppError } from "../utils/AppError.js";

export const getAllCoursesController = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // Default to 10 if not provided
    const courses = await getCoursesModel(limit);
    return res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("Error in getCourseController:", error);
    next(new AppError("Failed to fetch courses", 500, "COURSE_FETCH_ERROR"));
  }
};
