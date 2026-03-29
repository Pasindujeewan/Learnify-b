import dotenv from "dotenv";
dotenv.config();
export const errorHandler = (err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    code: err.code || "SERVER_ERROR",

    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};
