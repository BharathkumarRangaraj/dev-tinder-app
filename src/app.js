const { userAuth, adminAuth } = require("./middleware/auth");
const express = require("express");
const app = express();

//for user add/delete route
app.use("/user", userAuth);
app.get("/user/add", (req, res) => {
  res.send("user is authnticated succesfully and added new user");
});
app.use("/user/delete", (req, res) => {
  res.send("user is authnticated succesfully and deleted user");
});

//admin routes
app.use('/admin/login',(req,res)=>{
  res.send('admin has logged in with out authorization')
})
app.use('/admin',adminAuth,(req,res)=>{
  res.send('admin access is granded')
})


app.listen(7777, () => console.log("port running in 7777"));
