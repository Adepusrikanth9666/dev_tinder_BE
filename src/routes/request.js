const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const Users = require("../models/user");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"];

      if (fromUserId.toString() === toUserId) {
        return res.status(400).send("You cannot send request to yourself");
      }
      const isToUserExist = await Users.findById(toUserId);
      if (!isToUserExist) {
        return res
          .status(404)
          .send("The user you are trying to connect with does not exist.");
      }
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .send(
            "Invalid status value. Allowed values are 'interested' or 'ignored'.",
          );
      }

      const existingRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingRequest) {
        return res.status(400).send({
          message: "A connection request already exists between these users.",
        });
      }
      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.status(200).send({
        message: "Request sent successfully",
        data,
      });
    } catch (err) {
      res.status(500).send("Error :" + err.message);
    }
  },
);

module.exports = requestRouter;
