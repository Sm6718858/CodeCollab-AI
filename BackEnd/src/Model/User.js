const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: String,
  image: String,
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
