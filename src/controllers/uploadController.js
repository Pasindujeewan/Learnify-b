import fs from "fs/promises";
import { createRequire } from "module";
import { AppError } from "../utils/AppError.js";

const require = createRequire(import.meta.url);
const pdfModule = require("pdf-parse");
const parsePdf = pdfModule.default || pdfModule.pdf || pdfModule;

export const extractPdfSummary = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError("No PDF file uploaded", 400, "PDF_REQUIRED"));
    }

    const dataBuffer = await fs.readFile(req.file.path);
    const pdfData = await parsePdf(dataBuffer);
    const text = pdfData.text.trim();

    // These metrics help instructors quickly estimate lesson length.
    const words = text ? text.split(/\s+/) : [];
    const readingMinutes = Math.max(1, Math.ceil(words.length / 200));

    await fs.unlink(req.file.path).catch(() => undefined);

    return res.status(200).json({
      success: true,
      data: {
        text,
        wordCount: words.length,
        readingMinutes,
      },
    });
  } catch (error) {
    next(new AppError("Failed to process PDF", 500, "PDF_PROCESSING_FAILED"));
  }
};
