const express = require("express");
const app = express();

//order does matter in routing
app.get(
  "/abc",
  (req, res, next) => {
    console.log("hey its one");
    next();
    // res.send({ name: "raja", age: "34" });

  },
  (req,res,next) => {
    console.log("hey its 2");

    // res.send("hey its 2");
    next()
  },
    (req,res)=>{
console.log('hey its 3');
res.send('sending 3rd route paras')

    }
  
);

app.listen(7777, () => console.log("port running in 7777"));
