import { registerUser } from "../controllers/registerUser.js";
import express from "express";
import { loginUser } from "../controllers/LoginUser.js";

const router = express.Router();

// POST /api/register
router.post("/register", registerUser);
router.post("/login", loginUser);
export default router;
