const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());

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
app.get("/feed", async (req, res) => {
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

// update the User by emailID

// app.patch("/user", async (req, res) => {
//   const query = req.body.emailId;
//   const data = req.body;
//   try {
//     const user = await User.findOneAndUpdate({ emailId: query }, data, {
//       runValidators: true,
//     });
//     if (!user) {
//       res.status(500).send("User emailId not found");
//     } else {
//       res.send("User has been updated Successfully");
//     }
//   } catch (err) {
//     res.status(500).send("Error updating user");
//   }
// });

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
