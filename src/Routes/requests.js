const express=require('express');
const { userAuth } = require('../middleware/auth');
const requestsRouter=express.Router();

requestsRouter.post("/sendConnectionRequest", userAuth,async (req, res) => {
    try {
      res.send("req send successfully");
    } catch (error) {
      res.status(400).send("ERROR:" + error.message);
    }
  });
  module.exports=requestsRouter;