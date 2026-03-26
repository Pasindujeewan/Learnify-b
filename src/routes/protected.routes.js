import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { getUser } from "../controllers/getUser.controller.js";

const router = express.Router();

router.get("/me", verifyToken, getUser);

export default router;
