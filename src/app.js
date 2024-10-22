const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const user = require("./modal/user");
const { validateSignupData } = require("./utils/validation");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

app.use(express.json());
app.use(cookieParser());

//creating post API for signup.
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
  // const {cookies}=req.cookies;
  // const token=cookies;
  try {
    const { email, password } = req.body;
    const users = await user.findOne({ email: email });
    if (!users) {
      res.send("Invalid user Credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, users.password);
    if (isPasswordValid) {
      const token = jwt.sign({ _id: user._id }, "tinderdev@123");
      console.log(token,'tokenn');
      
      res.cookie("token",token);
      res.send("login Successfull");
    } else {
      res.send("not in db");
    }
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});
app.get("/profile",async(req,res)=>{
  try{
const cookies=req.cookies;
const{token}=cookies
const decodedtoken = await jwt.verify(token, 'tinderdev@123');
const{ _id }=decodedtoken;
console.log(decodedtoken)
res.send('readingcookie')

  }
  catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
})

//get user by emailid
app.get("/user", async (req, res) => {
  const oneuser = req.body.email;
  try {
    const userr = await user.findOne({ mail: oneuser });
    if (!user) {
      console.log("error received", error.message);
    } else {
      console.log(userr);

      res.send(userr);
    }
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

//get all the users //feed api

app.get("/fetch", async (req, res) => {
  try {
    const userr = await user.find({});
    res.send(userr);
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

//delete user from db

app.delete("/user", async (req, res) => {
  const userid = await req.body.userid;
  try {
    user.findByIdAndDelete(userid);
    res.send("user deleted successfully");
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

//update user form db

app.patch("/user", async (req, res) => {
  const userid = await req.body.userid;
  const data = await req.body;

  try {
    const allowup = ["firstName", "lastName", "password", "gender"];
    const allowedUpdateds = Object.keys(data).every((k) => {
      allowup.includes(k);
    });
    if (!allowedUpdateds) {
      throw new Error("not doable");
      res.send("not doable");
    }
    const users = await user.findByIdAndUpdate(userid, data);
    res.send("updated successfully");
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

connectDB()
  .then(() => {
    console.log("connected to dB successfully");
    app.listen(7777, () => {
      console.log("port running in 7777");
    });
  })
  .catch((err) => {
    console.log(err, "recieved error");
  });
