import cloudinary from "../config/cloudConfig.js";
import { AppError } from "../utils/AppError.js";
import dotenv from "dotenv";

export const generateSignature = (req, res, next) => {
  dotenv.config();
  try {
    const { type } = req.body;
    // Upload types map to separate Cloudinary folders to keep assets organized.
    const folderByType = {
      avatar: "avatars",
      course: "courses",
    };
    const folder = folderByType[type];

    if (!folder) {
      return next(
        new AppError(
          "Invalid upload type",
          400,
          "INVALID_UPLOAD_TYPE",
        ),
      );
    }

    const timestamp = Math.round(Date.now() / 1000);

    // The browser uploads directly to Cloudinary using this short-lived signature.
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
      },
      process.env.CLOUDINARY_API_SECRET,
    );

    return res.status(200).json({
      success: true,
      data: {
        timestamp,
        signature,
        folder,
        apiKey: process.env.CLOUDINARY_API_KEY,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      },
    });
  } catch (error) {
    next(
      new AppError(
        "Failed to generate Cloudinary signature",
        500,
        "SIGNATURE_GENERATION_FAILED",
      ),
    );
  }
};
