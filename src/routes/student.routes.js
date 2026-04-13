import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { rateCourseController } from "../controllers/ratingCourseController.js";
import { enrollCourse } from "../controllers/enrollCourse.js";

const router = express.Router();

router.post("/enroll/:courseId", verifyToken, enrollCourse);
router.post("/rate-course", verifyToken, rateCourseController);
export default router;
