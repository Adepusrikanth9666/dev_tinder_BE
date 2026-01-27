const express = require("express");
const { isAdmin, isUser } = require("./middlewares/auth");

const app = express();

app.use("/admin", isAdmin);

app.get("/user/profile", isUser, (req, res) => {
  console.log("user profile admin called");
  res.send("Welcome to the User Profile");
});

app.get("/admin/dashboard", (req, res) => {
  res.send("Welcome to the Admin Dashboard");
});

app.get("/admin/getAllUsers", (req, res) => {
  res.send("get all users data");
});

app.listen(7777, () => {
  console.log("Server is listening on port 7777");
});
