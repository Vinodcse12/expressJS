const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const Users = require("../models/users");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const { status, toUserId } = req.params;

    const allowedStatuses = ['ignored', 'interested'];
    
    if (!allowedStatuses.includes(status)) {
      throw new Error(`Invalid status`);
    }

    const toUser = await Users.findById(toUserId);
    if (!toUser) {
      throw new Error(`User with ID ${toUserId} not found`);
    }

    const existingRequest = await ConnectionRequest.findOne(
      {
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId }
        ]
      }
    );

    console.log(existingRequest);

    if (existingRequest) { 
      throw new Error(`Request already exists between these users`);
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });


    const data = await connectionRequest.save();
    res.status(200).send({
      message: req.user.firstName + " is " + status + " in " + toUser.firstName,
      data
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    console.log("review")
    const loggedInUser = req.user;
    const { status, requestId} = req.params;

    const allowStatus = ["accepted", "rejected"];

    if (!allowStatus.includes(status)) {
      throw new Error("Stats not allowed !")
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested"
    })

    if (!connectionRequest) {
      return res.status(404).json({
        message: "Connection request not found!"
      }) //
    }

    connectionRequest.status = status;

    const data = await connectionRequest.save();

    res.json({
      message: "Connection request" + status, 
      data
    })

  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
})

module.exports = requestRouter;