import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { requireRole } from "../middlewares/requireRole.js";
import {
  getInstructorCourse,
  listInstructorCourses,
} from "../controllers/instructorController.js";

const router = express.Router();

router.use(verifyToken, requireRole("instructor"));
router.get("/courses", listInstructorCourses);
router.get("/course/:courseId/full", getInstructorCourse);

export default router;
