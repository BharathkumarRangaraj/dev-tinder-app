const express = require("express");
const ConnectionRequest = require("../modal/connectionRequest");
const requestsRouter = express.Router();
const { userAuth } = require("../middleware/auth");

const user = require("../modal/user");

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
      if (!allowedStatus.includes(status)) {
        return res.status(400).send("this status is of action is not allowed");
      }

      //request user not found
      const touser = await user.findById(toUserId);
      if (!touser) {
        return res.status(400).json({ message: "user not found" });
      }

      //

      //   if(ConnectionRequest.fromUserId.equals(ConnectionRequest.toUserId)){
      //     return res.status(400).json({ message: "you can't raise request to yourself" });
      // }

      //check is request is been sent already
      const existingReqeust = await ConnectionRequest.findOne({
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

      const connectionRequestData = new ConnectionRequest({
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
//   "/request/review/:status/:requestId",
//   userAuth,
//   async (req, res) => {
//     const loggedInUser = req.user;
//     const status = req.params.status;
//     const requestId=req.params.requestId;

//     //making sure the status is only [accepted,rejected]
//     // const allowedStatus = ["accepted", "rejected"];
//     // if (!allowedStatus.includes(status)) {
//     //   return res.status(400).json({ message: "status not allowed" });
//     // }

//     //make sure the requestid,status=interested and touserId is loggedIn
//     // const connectionRequest = await connectionRequest.findOne({
//     //   _id: requestId,
//     //   toUserId: loggedInUser._id,
//     //   status: "interested",
//     // });
//     // if (!connectionRequests) {
//     //   return res
//     //     .status(400)
//     //     .json({ message: "connection Reqeust not Found !!" });
//     // }

//     connectionRequest.status=status;
// const data=await connectionRequest.save();
// res.json({ message: "Connection request " + status, data:data});

//   }
// );

requestsRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const {status} = req.params.status;
      const {requestId}=req.params.requestId;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ messaage: "Status not allowed!" });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        // _id: requestId,
        // toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({ message: "Connection request " + status, data });
    } catch (err) {
      res.status(400).send("ERROR f: " + err.message);
    }
  }
);
module.exports = requestsRouter;
