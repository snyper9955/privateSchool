const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: String,

  duration: String, // e.g. "3 months"

  fee: {
    type: Number,
    required: true,
  },

  batchTiming: String, // e.g. "6 PM - 8 PM"
  image: String, // URL to course thumbnail
  isFinished: {
    type: Boolean,
    default: false,
  },
  modules: [
    {
      title: { type: String, required: true },
      lessons: [
        {
          title: { type: String, required: true },
          videoUrl: String, // e.g. "https://www.youtube.com/watch?v=..."
          notesUrl: String, // e.g. "https://drive.google.com/..."
          assignmentUrl: String, // e.g. "https://drive.google.com/..."
        }
      ]
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);