const Payment = require("../models/Payment");
const Student = require("../models/Student");
const User = require("../models/User");
const Course = require("../models/Course");
// Razorpay is removed for direct enrollment
// const Razorpay = require("razorpay");
const crypto = require("crypto");

/*
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
*/

// ================= CREATE RAZORPAY ORDER =================
exports.createOrder = async (req, res) => {
  try {
    const { amount, courseId } = req.body;

    // Return dummy order for direct enrollment bypass
    const order = {
        id: `dummy_order_${Date.now()}`,
        amount: amount * 100,
        currency: "INR"
    };

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================= VERIFY PAYMENT & ENROLL =================
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId, method } = req.body;
    
    console.log('--- Payment Verification Started ---');
    console.log('Order ID:', razorpay_order_id);
    console.log('Payment ID:', razorpay_payment_id);
    console.log('Course ID:', courseId);
    console.log('User:', req.user?._id, req.user?.name);

    if (!courseId) {
        return res.status(400).json({ success: false, message: "Course ID is required" });
    }

    // Payment is valid
    const course = await Course.findById(courseId);
    if (!course) {
        console.log('Course not found:', courseId);
        return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Block enrollment if course is finished
    if (course.isFinished) {
        return res.status(400).json({ 
            success: false, 
            message: "This course has finished and is no longer accepting new enrollments." 
        });
    }

    // 1. Find or Create Student Record (Needed for Payment record)
    let student = await Student.findOne({ user: req.user._id });
    console.log('Existing student record:', student ? 'Found' : 'Not Found');
    
    if (student) {
        // Use $addToSet to prevent duplicate course IDs in the array
        await Student.updateOne(
            { _id: student._id },
            { 
                $addToSet: { 
                    courses: courseId,
                    paidCourses: courseId 
                },
                $set: { feeStatus: "paid" } // Legacy support
            }
        );
        console.log('Updated existing student record with course and paidCourse');
    } else {
        student = await Student.create({
            user: req.user._id,
            name: req.user.name,
            email: req.user.email,
            courses: [courseId],
            paidCourses: [courseId],
            feeStatus: "paid", // Legacy support
            admissionDate: new Date(),
        });
        console.log('Created new student record with course and paidCourse');
    }

    // Reload student to get latest data
    student = await Student.findById(student._id);

    // 2. Create Payment Record (Reference the student)
    const payment = await Payment.create({
      student: student._id,
      amount: course.fee || 0,
      method: method || "razorpay",
      transactionId: razorpay_payment_id || `sim_${Date.now()}`,
      status: "success",
    });
    console.log('Created payment record:', payment._id);

    // 3. Update User Role (if not admin)
    if (req.user.role === 'user' || req.user.role === 'student') {
        // Ensure role is 'student'
        await User.findByIdAndUpdate(req.user._id, { role: 'student' });
    }

    // 4. Notification
    const io = req.app.get('io');
    if (io) {
      io.to(req.user._id.toString()).emit('paymentSuccess', {
        amount: course.fee,
        customerName: req.user.name,
        transactionId: payment.transactionId,
        courseName: course.title
      });
    }

    console.log('--- Enrollment Successful ---');
    res.json({ success: true, message: "Enrolled successfully", student, payment });

  } catch (error) {
    console.error('VerifyPayment Error:', error);
    res.status(500).json({ 
        success: false, 
        message: "An error occurred during enrollment verification", 
        error: error.message 
    });
  }
};

// ================= MANUAL CREATE PAYMENT (Admin only) =================
exports.createPayment = async (req, res) => {
  try {
    const { studentId, amount, method, transactionId } = req.body;

    if (!studentId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Student ID and Amount are required",
      });
    }

    const payment = await Payment.create({
      student: studentId,
      amount,
      method,
      transactionId,
      status: "success",
    });

    const student = await Student.findByIdAndUpdate(studentId, {
      feeStatus: "paid",
    }, { new: true });

    const io = req.app.get('io');
    if (io && req.user) {
      io.to(req.user._id.toString()).emit('paymentSuccess', {
        amount: payment.amount,
        customerName: student ? student.name : 'Student',
        transactionId: payment.transactionId
      });
    }

    res.status(201).json({
      success: true,
      data: payment,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("student")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStudentPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      $or: [{ student: req.params.studentId }, { user: req.user?._id }]
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    await Payment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};