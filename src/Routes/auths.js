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
  try {
    const { email, password } = req.body;

    // Check if user exists
    const users = await user.findOne({ email });
    if (!users) {
      return res.status(400).json({ message: "Invalid user credentials" });
    }

    // Validate password
    const isPasswordValid = await users.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = await users.getJwt();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
      httpOnly: true, // Security improvement
    });

    return res.status(200).json({ message: "Login successful", user: users });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Internal Server Error" });
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
