import express from "express";
import { getAllCoursesController } from "../controllers/getAllCourse.controller.js";
import { addCourseController } from "../controllers/AddCourseController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();
// GET /api/courses/getall

router.get("/getall", getAllCoursesController);
router.post("/add", verifyToken, addCourseController);
export default router;
