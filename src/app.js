const express = require("express");
const app = express();

//order does matter in routing
app.get("/user", (req, res) => {
  res.send("posted");
});

app.delete("/user", (req, res) => {
  res.send("deleted user");
});
app.patch("/user", (req, res) => {
  res.send("patched user");
});
app.listen(7777, () => console.log("port running in 7777"));
