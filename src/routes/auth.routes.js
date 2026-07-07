import { registerUserController } from "../controllers/registerUser.js";
import express from "express";
import {
  loginUserController,
  logoutUserController,
} from "../controllers/LoginUser.js";

const router = express.Router();

// POST /api/register
router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.post("/logout", logoutUserController);
export default router;
