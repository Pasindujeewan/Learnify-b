import { AppError } from "../utils/AppError.js";
import {
  getCourseWithStudents,
  getCoursesByInstructor,
} from "../models/courseModel.js";

export const listInstructorCourses = async (req, res, next) => {
  try {
    const courses = await getCoursesByInstructor(req.user.userId);

    return res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    next(new AppError("Failed to load instructor courses", 500, "INSTRUCTOR_COURSES_FAILED"));
  }
};

export const getInstructorCourse = async (req, res, next) => {
  try {
    const course = await getCourseWithStudents(req.params.courseId, req.user.userId);

    return res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};
