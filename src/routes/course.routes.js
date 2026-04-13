import express from "express";
import { getAllCoursesController } from "../controllers/getAllCourse.controller.js";
import { addCourseController } from "../controllers/AddCourseController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { getFullCourseController } from "../controllers/getFullCourse.js";
import { getCourseCommentsController } from "../controllers/getCourseCommentsController.js";

const router = express.Router();
// GET /api/courses/getall

router.get("/getall", getAllCoursesController);
router.post("/add", verifyToken, addCourseController);
router.get("/comments/:courseId", getCourseCommentsController);

export default router;
