import { getCourseWithStudents } from "./courseModel.js";

export const getFullCourseModel = async (courseId) => {
  return getCourseWithStudents(courseId);
};
