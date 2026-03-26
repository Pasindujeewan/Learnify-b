import { findUserByEmail } from "../models/findUser.js";

export const getUser = async (req, res) => {
  console.log("get USer run");
  console.log(req.user);
  const user_Email = req.user.userEmail;
  console.log("then here", user_Email);

  try {
    const user = await findUserByEmail(user_Email);
    console.log("here work", user);
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
