import { v2 as cloudinary } from "cloudinary";
import { AppError } from "../utils/AppError.js";
import dotenv from "dotenv";
dotenv.config();

if (
  !process.env.CLOUD_NAME ||
  !process.env.API_KEY ||
  !process.env.API_SECRET
) {
  throw new AppError(
    "Missing Cloudinary environment variables",
    500,
    "CLOUDINARY_CONFIG_ERROR",
  );
}

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export default cloudinary;
