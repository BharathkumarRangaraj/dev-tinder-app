const express = require("express");
const user = require("../modal/user");
const { validateSignupData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const authRouter = express.Router();
//signup
authRouter.post("/signup", async (req, res) => {
  try {
    // Validate input data
    const errors = validateSignupData(req);
    if (errors) {
      return res.status(400).json({ success: false, message: errors });
    }

    const { firstName, lastname, email, password } = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new user({
      firstName,
      lastname,
      email,
      password: passwordHash,
    });

    await newUser.save();
    res.status(201).json({ success: true, message: "User added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//login
authRouter.post("/login", async (req, res) => {
  // const {cookies}=req.cookies;
  // const token=cookies;
  try {
    const { email, password } = req.body;
    const users = await user.findOne({ email: email });
    if (!users) {
      res.status(400).send("Invalid user Credentials");
    }
    const isPasswordValid = await users.validatePassword(password);
    if (isPasswordValid) {
      const token = await users.getJwt();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send(users);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

//logout
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("logged out successfully!!");
});

module.exports = authRouter;
