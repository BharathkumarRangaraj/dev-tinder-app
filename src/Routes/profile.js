const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");
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
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  const { password } = req.body;
  try {
     const loggedInUser = req.user;
    console.log(loggedInUser,'loggedinuserbefore');
    const hashedPassword = await bcrypt.hash(password, 10);
    loggedInUser.password = hashedPassword; 

    await loggedInUser.save();
    console.log(loggedInUser,'loggedinuserafter')
    res.json({
      message: `${loggedInUser.firstName}, your password updated successfuly`,
    });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

module.exports = profileRouter;
