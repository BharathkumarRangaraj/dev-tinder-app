const express = require("express");
const { userAuth } = require("../middleware/auth");
const requestsRouter = express.Router();
const user = require("../modal/user");
const connectionRequest = require("../modal/connectionRequest");

requestsRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      //to get only interested/ignored as a status
      const allowedStatus = ["interested", "ignored"];
      if (allowedStatus.includes(status)) {
        return res.status(400).send("this status is of action is not allowed");
      }

      //request user not found
      const touser = await user.findById(toUserId);
      if (!touser) {
        return res.status(400).json({ message: "user not found" });
      }

      //

    //   if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    //     return res.status(400).json({ message: "you can't raise request to yourself" });
    // }

    
      //check is request is been sent already
      const existingReqeust = await connectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingReqeust) {
        return res
          .status(400)
          .json({ message: "request was already been made" });
      }

      const connectionRequestData = new connectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequestData.save();

      res.json({
        message: req.user.firstName + "is" + status + "in" + touser.firstName,
        data: data,
      });
    } catch (error) {
      res.status(400).send("ERROR:" + error.message);
    }
  }
);
module.exports = requestsRouter;
