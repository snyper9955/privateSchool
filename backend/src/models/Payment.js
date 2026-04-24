const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },

  amount: {
    type: Number,
    required: true,
  },

  method: {
    type: String,
    enum: ["upi", "card", "netbanking", "cash", "razorpay", "student_reported", "manual"],
  },

  status: {
    type: String,
    enum: ["success", "failed", "pending"],
    default: "pending",
  },

  transactionId: String,

}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);