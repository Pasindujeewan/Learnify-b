import express from "express";
import multer from "multer";
import { generateSignature } from "../controllers/generateSignature.js";
import { extractPdfSummary } from "../controllers/uploadController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/signature", generateSignature);
router.post("/pdf", upload.single("pdf"), extractPdfSummary);
router.post("/uploads", upload.single("pdf"), extractPdfSummary);

export default router;
