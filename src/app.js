const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const user = require("./modal/user");

app.use(express.json());

//creating post API for signup.
app.post("/signup", async (req, res) => {
  const userdata = new user(req.body);

  try {
    await userdata.save();
    res.send("user added successfully");
  } catch (error) {
    console.log("error received", error.message);
  }
});

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
    console.log("error received", error.message);
  }
});

//get all the users //feed api

app.get("/fetch", async (req, res) => {

  try {
    const userr = await user.find({ });
    res.send(userr)
  } catch (error) {
    console.log("error received", error.message);
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
