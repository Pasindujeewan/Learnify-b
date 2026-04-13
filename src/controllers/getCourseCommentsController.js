import { getCourseCommentsModel } from "../models/getCourseComments.js";
import { AppError } from "../utils/AppError.js";
export const getCourseCommentsController = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const comments = await getCourseCommentsModel(courseId);
    return res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (e) {
    console.log("a error occur during get comments", e);
    next(new AppError("A error occur during get comments", 500, "SEVER_ERROR"));
  }
};
