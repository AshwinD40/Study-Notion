const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Review", "Resolved"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
