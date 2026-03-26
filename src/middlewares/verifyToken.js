import jwt from "jsonwebtoken";
import express from "express";

export const verifyToken = (req, res, next) => {
  console.log("It is come req");
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  console.log(token, "is it valid");

  if (!token) {
    return res.status(401).json({
      code: "NO_TOKEN",
      message: "Not authenticated",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    console.log("user is get", decoded);
    next();
  } catch (err) {
    return res.status(401).json({
      code: "INVALID_TOKEN",
      message: "Token invalid or expired",
    });
  }
};
