import cloudinary from "../config/cloudConfig.js";
import { AppError } from "../utils/AppError.js";
import dotenv from "dotenv";

export const generateSignature = (req, res, next) => {
  dotenv.config();
  console.log("reqest is comming to signature");
  try {
    const { type } = req.body;
    console.log("Upload type:", type);
    console.log("Cloudinary config:", {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
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
      process.env.CLOUDINARY_API_SECRET,
    );

    console.log("here is signature", { timestamp, signature });
    return res.status(200).json({
      success: true,
      data: {
        timestamp,
        signature,
        apiKey: process.env.CLOUDINARY_API_KEY,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || "dldysu3pv",
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
