import { v2 as cloudinary } from "cloudinary";
import { AppError } from "../utils/AppError.js";
import dotenv from "dotenv";
dotenv.config();

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new AppError(
    "Missing Cloudinary environment variables",
    500,
    "CLOUDINARY_CONFIG_ERROR",
  );
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
