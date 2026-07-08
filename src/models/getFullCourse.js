import { getCourseWithStudents } from "./courseModel.js";

export const getFullCourseModel = async (courseId) => {
  // Compatibility wrapper for older controller names around the shared course model.
  return getCourseWithStudents(courseId);
};
