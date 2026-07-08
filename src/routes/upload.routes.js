import express from "express";
import multer from "multer";
import { generateSignature } from "../controllers/generateSignature.js";
import { extractPdfSummary } from "../controllers/uploadController.js";
import { AppError } from "../utils/AppError.js";

const router = express.Router();
// PDFs are stored only long enough for the parser to extract text.
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new AppError("Only PDF files are supported", 400, "INVALID_FILE_TYPE"));
    }

    cb(null, true);
  },
});

// Image uploads use Cloudinary signatures; PDF uploads use local multipart parsing.
router.post("/signature", generateSignature);
router.post("/pdf", upload.single("pdf"), extractPdfSummary);
router.post("/uploads", upload.single("pdf"), extractPdfSummary);

export default router;
