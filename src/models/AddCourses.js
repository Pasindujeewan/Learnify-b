import { createCourse } from "./courseModel.js";

export const addCourse = async (courseData) => {
  // Small wrapper keeps the controller decoupled from the course SQL implementation.
  return createCourse(courseData);
};
