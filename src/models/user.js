const mongoose = require("mongoose");

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
    },
    skills: [{ type: String }],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Users", userSchema);
