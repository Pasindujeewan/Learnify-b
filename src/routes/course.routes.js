import express from "express";
import {
  getAllCoursesController,
  getCourseController,
} from "../controllers/getAllCourse.controller.js";
import { addCourseController } from "../controllers/AddCourseController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { requireRole } from "../middlewares/requireRole.js";
import { getCourseCommentsController } from "../controllers/getCourseCommentsController.js";
import { getPublicCourseLessons } from "../controllers/lessonController.js";

const router = express.Router();

// Public catalog routes let guests browse courses before registration.
router.get("/", getAllCoursesController);
router.get("/getall", getAllCoursesController);
router.get("/comments/:courseId", getCourseCommentsController);
router.get("/:courseId/lessons", getPublicCourseLessons);
router.get("/:courseId", getCourseController);

// Only instructors can create courses, and ownership is assigned from the token.
router.post("/", verifyToken, requireRole("instructor"), addCourseController);
router.post("/add", verifyToken, requireRole("instructor"), addCourseController);

export default router;
