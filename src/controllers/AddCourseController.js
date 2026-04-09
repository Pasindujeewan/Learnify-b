import { addCourse } from "../models/AddCourses.js";
import { AppError } from "../utils/AppError.js";
export const addCourseController = async (req, res, next) => {
  try {
    const couseData = req.body;
    const result = await addCourse(couseData);
    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error in addCourseController:", error);
    next(new AppError("Failed to add course", 500, "COURSE_CREATION_ERROR"));
  }
};
