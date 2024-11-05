const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { validateEditProfileData, validateForgotPassword } = require("../utils/validation");
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("edit this field is not allowed, try again");
    }
    const loggedInUser = req.user;
    console.log(loggedInUser,'loggedinuserbefore')

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();
    console.log(loggedInUser,'loggedinuserafter')
    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfuly`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});
profileRouter.get("/profile/password", userAuth, async (req, res) => {
  try {
    if (!validateForgotPassword(req)) {
      throw new Error("edit this field is not allowed, try again");
    }
    const loggedInUser = req.user;
    console.log(loggedInUser,'loggedinuserbefore')

    Object.keys(req.body.password).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();
    console.log(loggedInUser,'loggedinuserafter')
    res.json({
      message: `${loggedInUser.firstName}, your password updated successfuly`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

module.exports = profileRouter;
