import { findUserByEmail } from "../models/findUserByEmail.js";

export const getUser = async (req, res) => {
  const user_Email = req.user.userEmail;

  try {
    const user = await findUserByEmail(user_Email);

    res.json({
      success: "success",
      user,
    });
  } catch (e) {
    res.json({
      code: "INTERNAL_SERVER_ERROR",
      message: "",
    });
  }
};
