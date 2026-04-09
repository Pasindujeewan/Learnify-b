import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";

import { enrollCourse } from "../controllers/enrollCourse.js";

const router = express.Router();

router.post("/enroll/:courseId", verifyToken, enrollCourse);

export default router;
