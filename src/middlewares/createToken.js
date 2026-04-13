import jwt from "jsonwebtoken";

export const createToken = ({ userId, userEmail, role }) => {
  const token = jwt.sign({ userId, userEmail, role }, process.env.JWT_SECRET, {
    expiresIn: "10h",
  });
  return token;
};
