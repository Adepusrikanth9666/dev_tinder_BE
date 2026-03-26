const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const User = require("../models/user");
const validate = require("validator");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(500).send("Error :" + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid data provided for profile update");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
    await loggedInUser.save();
    res.send("Profile updated successfully");
  } catch (err) {
    res.status(500).send("Error :" + err.message);
  }
});

profileRouter.patch("/profile/updatePassword", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validate.isStrongPassword(password)) {
      throw new Error("Password is not valid!!");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("User not found");
    }
    user.password = passwordHash;
    await user.save();
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res.send("Password updated successfully");
  } catch (err) {
    res.status(500).send("Error :" + err.message);
  }
});
module.exports = profileRouter;
