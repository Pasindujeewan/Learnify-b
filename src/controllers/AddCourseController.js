import { addCourse } from "../models/AddCourses.js";
import { AppError } from "../utils/AppError.js";
export const addCourseController = async (req, res, next) => {
  try {
    // Trust the authenticated token for ownership, not a browser-submitted instructorId.
    const courseData = {
      ...req.body,
      instructorId: req.user.userId,
    };

    if (!courseData.title || !courseData.description || !courseData.category) {
      return next(
        new AppError("Title, description, and category are required", 400, "COURSE_FIELDS_REQUIRED"),
      );
    }

    const result = await addCourse(courseData);
    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    next(new AppError("Failed to add course", 500, "COURSE_CREATION_ERROR"));
  }
};
