const mongoose = require("mongoose");
const validate = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
    },
    lastName: { type: String },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: (v) => {
        if (!validate.isEmail(v)) {
          throw new Error("Invalid email format");
        }
      },
    },
    password: { type: String, required: true, minlength: 6 },
    age: { type: Number, min: 18 },
    gender: {
      type: String,
      validate: (v) => {
        if (!["male", "female", "other"].includes(v)) {
          throw new Error("Gender must be male, female, or other");
        }
      },
    },
    about: { type: String, default: "This is about my profile" },
    imageUrl: {
      type: String,
      default:
        "https://thumbs.dreamstime.com/b/profile-logo-vector-icon-template-illustration-profile-template-icon-336477251.jpg",
      validate: (v) => {
        if (!validate.isURL(v)) {
          throw new Error("Invalid URL format");
        }
      },
    },
    skills: [{ type: String }],
  },
  { timestamps: true },
);

userSchema.methods.getJwtToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "Dev@tinder@777", {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordUserInput) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(passwordUserInput, passwordHash);
  return isPasswordValid;
};

module.exports = mongoose.model("Users", userSchema);
