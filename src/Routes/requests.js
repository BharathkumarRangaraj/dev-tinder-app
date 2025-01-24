const express = require("express");
const ConnectionRequest = require("../modal/connectionRequest");
const requestsRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const user = require("../modal/user");

// Route to send a connection request
requestsRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      // Allow only "interested" or "ignored" as valid statuses
      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).send("This status of action is not allowed");
      }

      // Check if the user to whom the request is being sent exists
      const toUser = await user.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({ message: "User not found" });
      }

      // Prevent users from sending requests to themselves
      if (fromUserId.equals(toUserId)) {
        return res
          .status(400)
          .json({ message: "You cannot send a request to yourself" });
      }

      // Check if a request already exists between these users
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingRequest) {
        return res
          .status(400)
          .json({ message: "Request has already been made" });
      }

      // Create and save a new connection request
      const connectionRequestData = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequestData.save();

      res.json({
        message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
        data: data,
      });
    } catch (error) {
      res.status(400).send("ERROR: " + error.message);
    }
  }
);

// Route to review a connection request
requestsRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user; // Logged-in user details
      const { status, requestId } = req.params; // Extract status and requestId from params

      // Allow only "accepted" or "rejected" as valid statuses
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed!" });
      }

      // Ensure the request exists and matches the logged-in user as the `toUserId`
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId, // Match by requestId
        toUserId: loggedInUser._id, // Only the intended recipient can act on the request
        status: "interested", // Only interested requests can be reviewed
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({
            message: "Connection request not found or not eligible for review",
          });
      }

      // Update the request's status
      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.json({
        message: `Connection request ${status}`,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

module.exports = requestsRouter;
