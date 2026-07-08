import { getCourses } from "./courseModel.js";

export const getCoursesModel = async (limit) => {
  // Keep the public catalog model API stable while courseModel owns the SQL.
  return getCourses({ limit });
};
