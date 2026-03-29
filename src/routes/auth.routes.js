import { registerUserController } from "../controllers/registerUser.js";
import express from "express";
import { loginUserController } from "../controllers/LoginUser.js";

const router = express.Router();

// POST /api/register
router.post("/register", registerUserController);
router.post("/login", loginUserController);
export default router;
