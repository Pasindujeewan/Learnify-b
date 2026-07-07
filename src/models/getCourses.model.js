import { getCourses } from "./courseModel.js";

export const getCoursesModel = async (limit) => {
  return getCourses({ limit });
};
