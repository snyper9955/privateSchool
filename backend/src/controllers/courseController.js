const Course = require("../models/Course");


// ================= CREATE COURSE =================
exports.createCourse = async (req, res) => {
  try {
    const { title, description, duration, fee, batchTiming, image, modules, isFinished } = req.body;

    const course = await Course.create({
      title,
      description,
      duration,
      fee,
      batchTiming,
      image,
      modules: modules || [],
      isFinished: isFinished || false,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });

  } catch (error) {
    console.error("Create Course Error:", error);
    res.status(400).json({ 
      success: false,
      message: error.message || "Failed to create course" 
    });
  }
};


// ================= GET ALL COURSES =================
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: courses.length,
      data: courses,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ================= GET SINGLE COURSE =================
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.json({
      success: true,
      data: course,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ================= UPDATE COURSE =================
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.json({
      success: true,
      message: "Course updated",
      data: course,
    });

  } catch (error) {
    console.error("Update Course Error:", error);
    res.status(400).json({ 
      success: false,
      message: error.message || "Failed to update course" 
    });
  }
};


// ================= DELETE COURSE =================
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({
      success: true,
      message: "Course deleted",
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


