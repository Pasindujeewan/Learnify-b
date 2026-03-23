import express from "express";
import { generateSignature } from "../controllers/generateSignature.js";

const router = express.Router();

// POST /api/upload/signature
router.post("/signature", generateSignature);

export default router;
