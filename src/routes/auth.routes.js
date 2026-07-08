import { registerUserController } from "../controllers/registerUser.js";
import express from "express";
import {
  loginUserController,
  logoutUserController,
} from "../controllers/LoginUser.js";

const router = express.Router();

// Auth endpoints live under /api/auth and set or clear the HTTP-only cookie.
router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.post("/logout", logoutUserController);
export default router;
