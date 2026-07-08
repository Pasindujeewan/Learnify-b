import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { requireRole } from "../middlewares/requireRole.js";
import { rateCourseController } from "../controllers/ratingCourseController.js";
import { enrollCourse } from "../controllers/enrollCourse.js";
import {
  completeStudentLesson,
  getStudentCourseLessons,
  getStudentCourseProgress,
} from "../controllers/lessonController.js";

const router = express.Router();

// Every route in this file is student-only after this middleware.
router.use(verifyToken, requireRole("student"));
router.post("/enroll/:courseId", enrollCourse);
router.post("/rate-course", rateCourseController);
router.get("/courses/:courseId/lessons", getStudentCourseLessons);
router.get("/courses/:courseId/progress", getStudentCourseProgress);
router.post("/lessons/:lessonId/complete", completeStudentLesson);

export default router;
