import { createCourse } from "./courseModel.js";

export const addCourse = async (courseData) => {
  return createCourse(courseData);
};
