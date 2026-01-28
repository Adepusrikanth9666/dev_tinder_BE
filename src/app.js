const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validate = require("validator");
const cookieParse = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParse());
app.post("/signup", async (req, res) => {
  try {
    // validation of data
    validateSignUpData(req);

    // Encrypt the password
    const { password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      ...req.body,
      password: passwordHash,
    });
    await user.save();
    res.send("User signed up successfully");
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(500).send("Error :" + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validate.isEmail(emailId)) {
      throw new Error("Not a valid Email ID");
    }
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJwtToken();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 1 * 3600000),
      });
      res.send("User logged in successfully");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(500).send("Error :" + err.message);
  }
});

// get user by userID _id
app.get("/user", async (req, res) => {
  const userId = req.body.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    send.status(500).send("Error fetching user data");
  }
});

// get User by emailId
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await User.findOne({ emailId: userEmail });
    if (!users) {
      return res.status(404).send("User not found");
    } else {
      console.log("User data fetched successfully");
      res.send(users);
    }
  } catch (err) {
    res.status(500).send("Error fetching user data");
  }
});

// get all users for feed
app.get("/feed", userAuth, async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send("Error fetching users ");
  }
});

// delete user by id
app.delete("/user", async (req, res) => {
  const userId = req.body.id;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).send("User not found");
    }
    res.send("User deleted successfully");
  } catch (err) {
    res.status(500).send("Error deleting user");
  }
});

// update teh user by _id
app.patch("/user/:id", async (req, res) => {
  const userId = req.params.id;
  const data = req.body;
  try {
    const USER_UPDATES_ALLOWED = [
      "imageUrl",
      "about",
      "skills",
      "age",
      "gender",
    ];
    const updates = Object.keys(data);
    const isValidOperation = updates.every((update) =>
      USER_UPDATES_ALLOWED.includes(update),
    );
    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid updates!" });
    }
    const user = await User.findByIdAndUpdate(userId, data);
    if (!user) {
      res.status(500).send("User id not found");
    }
    res.send("User has been updated Succesfully");
  } catch (err) {
    res.status(500).send("Error updated user");
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const { firstName } = req.user;
  res.send("Connection request sent by " + firstName + " successfully");
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(7777, () => {
      console.log("Server is listening on port 7777");
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
