import { AppError } from "../utils/AppError.js";
import { enrollCourseModel } from "../models/enrollCourse.js";
export const enrollCourse = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user.userId;
    console.log(`Enrolling user ${userId} to course ${courseId}`);
    const enrollment = await enrollCourseModel({ courseId, userId });
    console.log("Enrollment result:", enrollment);
    return res
      .status(201)
      .json({ message: "Enrolled successfully", enrollment });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    next(new AppError("Failed to enroll in course", 500, "ERROR_OCCURED"));
  }
};
