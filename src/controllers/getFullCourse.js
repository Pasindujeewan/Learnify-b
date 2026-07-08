import { getFullCourseModel } from "../models/getFullCourse.js";

export const getFullCourseController = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    // Full course details are used by instructor views that need enrollment data too.
    const courseDetails = await getFullCourseModel(courseId);
    return res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (error) {
    next(error);
  }
};
