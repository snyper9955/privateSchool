const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,

  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  }],
  paidCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  admissionDate: {
    type: Date,
    default: Date.now,
  },

  feeStatus: {
    type: String,
    enum: ["paid", "pending"],
    default: "pending",
  },

  documents: [String], // file paths

}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);