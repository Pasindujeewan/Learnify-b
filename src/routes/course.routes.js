import express from "express";
import {
  getAllCoursesController,
  getCourseController,
} from "../controllers/getAllCourse.controller.js";
import { addCourseController } from "../controllers/AddCourseController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { requireRole } from "../middlewares/requireRole.js";
import { getCourseCommentsController } from "../controllers/getCourseCommentsController.js";

const router = express.Router();

router.get("/", getAllCoursesController);
router.get("/getall", getAllCoursesController);
router.get("/comments/:courseId", getCourseCommentsController);
router.get("/:courseId", getCourseController);
router.post("/", verifyToken, requireRole("instructor"), addCourseController);
router.post("/add", verifyToken, requireRole("instructor"), addCourseController);

export default router;
