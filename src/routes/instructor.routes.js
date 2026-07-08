import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { requireRole } from "../middlewares/requireRole.js";
import {
  getInstructorCourse,
  listInstructorCourses,
} from "../controllers/instructorController.js";
import {
  createInstructorLesson,
  getPublicCourseLessons,
} from "../controllers/lessonController.js";

const router = express.Router();

// Instructor lesson/course management is protected as a group.
router.use(verifyToken, requireRole("instructor"));
router.get("/courses", listInstructorCourses);
router.get("/course/:courseId/full", getInstructorCourse);
router.get("/courses/:courseId/lessons", getPublicCourseLessons);
router.post("/courses/:courseId/lessons", createInstructorLesson);

export default router;
