const express = require("express");
const app = express();
const {connectDB} = require("./config/database");

connectDB()
  .then(() => {
    console.log("connected to dB successfully");
    app.listen(7777, () => {console.log("port running in 7777")});
  })
.catch((err) => {
    console.log(err, "recieved error");
  });
