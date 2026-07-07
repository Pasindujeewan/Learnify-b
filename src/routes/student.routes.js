import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { requireRole } from "../middlewares/requireRole.js";
import { rateCourseController } from "../controllers/ratingCourseController.js";
import { enrollCourse } from "../controllers/enrollCourse.js";

const router = express.Router();

router.use(verifyToken, requireRole("student"));
router.post("/enroll/:courseId", enrollCourse);
router.post("/rate-course", rateCourseController);

export default router;
