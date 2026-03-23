import { registerUser } from "../controllers/registerUser.js";
import express from "express";

const router = express.Router();

// POST /api/register
router.post("/register", registerUser);

export default router;
