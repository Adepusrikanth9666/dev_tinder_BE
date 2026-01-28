const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://srikanthadepu17_db_user:di5mAY5FKDaSlYkm@tinderdb.szq14or.mongodb.net/devTinderDB",
  );
};

module.exports = connectDB;
