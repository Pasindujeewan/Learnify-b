import cloudinary from "../config/cloudConfig.js";

export const generateSignature = (req, res) => {
  // Only allow avatar uploads for now
  const { type } = req.body;
  if (!type || type !== "avatar") {
    return res.status(400).json({
      message: "Invalid upload type",
    });
  }
  // Generate a timestamp and signature for Cloudinary upload
  const timestamp = Math.round(Date.now() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder: "avatars",
    },
    process.env.API_SECRET,
  );
  // Return the signature and other necessary info to the client
  res.json({
    timestamp,
    signature,
    apiKey: process.env.API_KEY,
    cloudName: process.env.CLOUD_NAME,
  });
};
