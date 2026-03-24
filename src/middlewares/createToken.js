import jwt from "jsonwebtoken";

export const createToken = ({ userId, userEmail }) => {
  const token = jwt.sign({ userId, userEmail }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};
