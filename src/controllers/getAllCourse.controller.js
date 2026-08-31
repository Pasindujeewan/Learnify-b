import { getCourseById } from "../models/courseModel.js";
import { getCourses } from "../models/courseModel.js";
import { AppError } from "../utils/AppError.js";

export const getAllCoursesController = async (req, res, next) => {
  try {
    // Limit keeps the public catalog response small enough for the course grid.
    const limit = Math.min(parseInt(req.query.limit, 10) || 24, 24);
    const courses = await getCourses(limit);
    return res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    next(new AppError("Failed to fetch courses", 500, "COURSE_FETCH_ERROR"));
  }
};

export const getCourseController = async (req, res, next) => {
  try {
    // Details are public; enrollment and lesson completion stay protected elsewhere.
    const course = await getCourseById(req.params.courseId);

    return res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};
