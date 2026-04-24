const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema({
  name: String,
  phone: String,
  message: String,

  courseInterested: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },

  status: {
    type: String,
    enum: ["new", "contacted", "converted"],
    default: "new",
  },

}, { timestamps: true });

module.exports = mongoose.model("Inquiry", inquirySchema);