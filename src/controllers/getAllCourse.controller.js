import { getCourseById } from "../models/courseModel.js";
import { getCoursesModel } from "../models/getCourses.model.js";
import { AppError } from "../utils/AppError.js";

export const getAllCoursesController = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 24;
    const courses = await getCoursesModel(limit);
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
    const course = await getCourseById(req.params.courseId);

    return res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};
