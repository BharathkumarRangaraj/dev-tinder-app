const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const user = require("./modal/user");
const { validateSignupData } = require("./utils/validation");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {userAuth}=require("./middleware/auth");
const authRouters=require('./Routes/auths');
const profileRouters=require('./Routes/profile');
const requestsRouter=require('./Routes/requests');


app.use(express.json());
app.use(cookieParser());

//express.router group APIS

app.use('/',authRouters);
app.use('/',profileRouters);
app.use('/',requestsRouter);

//get user by emailid
app.get("/user",userAuth, async (req, res) => {
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
