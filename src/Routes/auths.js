const express=require('express');
const user = require('../modal/user');
const { validateSignupData } = require('../utils/validation');
const bcrypt = require("bcrypt");
const authRouter=express.Router();
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
  
//login
  authRouter.post("/login", async (req, res) => {
    // const {cookies}=req.cookies;
    // const token=cookies;
    try {
      const { email, password } = req.body;
      const users = await user.findOne({ email: email });
      if (!users) {
        res.send("Invalid user Credentials");
      }
      const isPasswordValid = await users.validatePassword(password)
      if (isPasswordValid) {
        const token = await users.getJwt();
        
        res.cookie("token",token,{expires:new Date(Date.now()+8*3600000)});
        res.send("login Successfull");
      } else {
        res.send("not in db");
      }
    } catch (error) {
      res.status(400).send("ERROR:" + error.message);
    }
  });

module.exports=authRouter;