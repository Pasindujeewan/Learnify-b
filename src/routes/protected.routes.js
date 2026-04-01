import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { getUserController } from "../controllers/getUser.controller.js";

const router = express.Router();

router.get("/me", verifyToken, getUserController);

export default router;
