const express = require("express");
const user = require("../modal/user");
const { validateSignupData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const authRouter = express.Router();
//signup
authRouter.post("/signup", async (req, res) => {
  const userdata = new user(req.body);
  try {
    //validate the inputs
    validateSignupData(req);

    const { firstName, lastname, email, password } = req.body;
    //encrypting the password
    const passwordhash = await bcrypt.hash(password, 10);
    console.log(passwordhash);

    //creating new instance of modal
    const userdata = new user({
      firstName,
      lastname,
      email,
      password: passwordhash,
    });
    await userdata.save();
    res.send("user added successfully");
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});


module.exports = authRouter;
