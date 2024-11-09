const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../modal/connectionRequest");
const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastname email about";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "data fetched succesfully",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest
      .find({
        $or: [
          { toUserId: loggedInUser._id, status: "accepted" },
          { fromUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
      const data=connectionRequests.map((row)=>{
        if(row.fromUserId._id.toString()===row.toUserId._id.toString()){
            return row.toUserId;
        }
        return row.fromUserId
      })
      res.json({
        message: "data fetched succesfully",
        data: data,
      });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});
module.exports = userRouter;
