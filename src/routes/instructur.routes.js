import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { getFullCourseController } from "../controllers/getFullCourse.js";

const router = express.Router();

router.get("/course/:courseId/full", verifyToken, getFullCourseController);

export default router;
