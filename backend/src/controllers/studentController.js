const Student = require("../models/Student");
const Inquiry = require("../models/Inquiry");
const Payment = require("../models/Payment");
const Course = require("../models/Course");
const User = require("../models/User");


// ================= REGISTER STUDENT =================
exports.registerStudent = async (req, res) => {
  try {
    const { name, phone, course, feeStatus } = req.body;
    const email = req.body.email?.toLowerCase();

    if (!name || !course) {
      return res.status(400).json({
        success: false,
        message: "Name and Course are required",
      });
    }

    // 1. Check if user exists with this email to link them
    let userId = null;
    if (email) {
      // Use case-insensitive regex for user lookup to handle mixed-case registrations
      const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
      if (user) {
        userId = user._id;
        // Update role if they are just a user
        if (user.role === 'user') {
          user.role = 'student';
          await user.save();
        }
      }
    }

    // 2. Check if student already exists
    // Prioritize finding a record already linked to the User ID for dashboard consistency
    let student;
    if (userId) {
      student = await Student.findOne({ user: userId });
    }
    
    // Fallback to email lookup if not found by userId (case-insensitive)
    if (!student && email) {
      student = await Student.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
    }

    if (student) {
      // Update existing student
      // Use $addToSet to avoid duplicate course assignments
      const updateData = { 
        name: name || student.name,
        phone: phone || student.phone,
        user: userId || student.user, // Link if found
      };

      // Per-Course Status Logic:
      if (feeStatus === 'paid') {
        // Add to courses and paidCourses (using $addToSet for both)
        await Student.updateOne(
          { _id: student._id },
          { 
            $addToSet: { 
              courses: course,
              paidCourses: course 
            },
            $set: updateData
          }
        );
      } else {
        // Add to courses but Remove from paidCourses if it was set to pending (downgrade)
        // or just add to courses if new
        await Student.updateOne(
          { _id: student._id },
          { 
            $addToSet: { courses: course },
            $pull: { paidCourses: course },
            $set: updateData
          }
        );
      }
      student = await Student.findById(student._id).populate("courses").populate("paidCourses");
    } else {
      // Create new student
      student = await Student.create({
        name,
        phone,
        email,
        courses: [course],
        paidCourses: feeStatus === 'paid' ? [course] : [],
        user: userId, // Link if found
      });
      student = await student.populate("courses");
      student = await student.populate("paidCourses");
    }

    // Handle Inquiry tracking
    if (email) {
      const existingInquiry = await Inquiry.findOne({ email });
      if (existingInquiry) {
        existingInquiry.status = "converted";
        await existingInquiry.save();
      } else {
        await Inquiry.create({
          name,
          phone,
          email,
          courseInterested: course,
          status: "converted",
          message: "Manually registered by Admin",
        });
      }
    }

    // Emit socket event for real-time dashboard update
    const io = req.app.get("io");
    if (io && userId) {
      io.emit("paymentSuccess", { 
        userId: userId,
        message: "Manually enrolled by admin",
        studentId: student._id 
      });
    }

    res.status(201).json({
      success: true,
      message: student.isNew ? "Student registered successfully" : "Student updated and enrolled",
      data: student,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ================= GET ALL STUDENTS =================
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate("courses") // show course details
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: students.length,
      data: students,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ================= GET SINGLE STUDENT =================
exports.getSingleStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate("courses");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      data: student,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ================= UPDATE STUDENT =================
exports.updateStudent = async (req, res) => {
  try {
    // 1. Get original student state to check for changes
    const originalStudent = await Student.findById(req.params.id);
    if (!originalStudent) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const { feeStatus, courseId } = req.body;

    // 2. Perform update
    let updateQuery = { $set: {} };
    let arrayQuery = {};

    // Apply global updates
    Object.keys(req.body).forEach(key => {
      if (key !== 'courseId' && key !== 'feeStatus') {
        updateQuery.$set[key] = req.body[key];
      }
    });

    // Handle Granular Course Payment status
    if (courseId) {
      if (feeStatus === 'paid') {
        arrayQuery.$addToSet = { paidCourses: courseId };
      } else if (feeStatus === 'pending') {
        arrayQuery.$pull = { paidCourses: courseId };
      }
    } else {
      // Legacy support: if no courseId, update global status (affects all)
      if (feeStatus) updateQuery.$set.feeStatus = feeStatus;
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { ...updateQuery, ...arrayQuery },
      { new: true, runValidators: true }
    ).populate("courses").populate("paidCourses");

    // 3. If a specific course was paid, create a payment record
    if (feeStatus === "paid" && (courseId || (!originalStudent.paidCourses?.includes(courseId)))) {
      const targetCourse = await Course.findById(courseId || student.courses?.[0]);
      const amount = targetCourse?.fee || 0;

      await Payment.create({
        student: student._id,
        amount,
        method: "cash",
        status: "success",
        transactionId: `manual_${courseId || 'global'}_${Date.now()}`
      });
    }

    res.json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ================= DELETE STUDENT =================
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      message: "Student deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ================= GET STUDENT DASHBOARD DATA =================
exports.getStudentDashboardData = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
      .populate("courses")
      .populate("paidCourses");

    if (!student) {
      // Fallback: search by email if userId not linked yet (case-insensitive)
      const email = req.user.email;
      const studentByEmail = await Student.findOne({ 
        email: { $regex: new RegExp(`^${email}$`, "i") } 
      }).populate("courses").populate("paidCourses");
        
      if (!studentByEmail) {
        return res.status(404).json({
          success: false,
          message: "Student profile not found",
        });
      }
      
      // Permanently link the user to this student profile for future lookups
      studentByEmail.user = req.user._id;
      await studentByEmail.save();

      // Get payments for this student
      const payments = await Payment.find({ student: studentByEmail._id });

      return res.json({ 
        success: true, 
        data: {
          ...studentByEmail.toObject(),
          payments
        }
      });
    }

    // Get payments for this student
    const payments = await Payment.find({ student: student._id });

    res.json({
      success: true,
      data: {
        ...student.toObject(),
        payments
      },
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};