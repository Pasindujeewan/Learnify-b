import cloudinary from "../config/cloudConfig.js";
import { AppError } from "../utils/AppError.js";

export const generateSignature = (req, res, next) => {
  try {
    const { type } = req.body;

    // validation error (client mistake)
    if (!type || type !== "avatar") {
      return next(
        new AppError(
          "Invalid upload type. Only 'avatar' is allowed",
          400,
          "INVALID_UPLOAD_TYPE",
        ),
      );
    }

    const timestamp = Math.round(Date.now() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: "avatars",
      },
      process.env.API_SECRET,
    );

    res.status(200).json({
      success: true,
      data: {
        timestamp,
        signature,
        apiKey: process.env.API_KEY,
        cloudName: process.env.CLOUD_NAME,
      },
    });
  } catch (error) {
    // unexpected errors
    next(
      new AppError(
        "Failed to generate Cloudinary signature",
        500,
        "SIGNATURE_GENERATION_FAILED",
      ),
    );
  }
};
