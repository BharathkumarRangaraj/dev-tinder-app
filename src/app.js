const express = require("express");
const app = express();

//order does matter in routing
app.get("/abc/:pass/:place", (req, res) => {
    console.log(req.query);
    console.log(req.params);
    
    
    
  res.send({name:'raja',age:'34'});
});


app.listen(7777, () => console.log("port running in 7777"));
