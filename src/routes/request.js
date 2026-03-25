const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const { firstName } = req.user;
  res.send("Connection request sent by " + firstName + " successfully");
});

module.exports = requestRouter;
