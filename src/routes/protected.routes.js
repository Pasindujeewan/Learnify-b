import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { getUserController } from "../controllers/getUser.controller.js";

const router = express.Router();

// The frontend calls this route on refresh to rebuild the current user session.
router.get("/me", verifyToken, getUserController);

export default router;
