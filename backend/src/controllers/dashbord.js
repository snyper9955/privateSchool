const Student = require("../models/Student");
const Payment = require("../models/Payment");
const Course = require("../models/Course");
const Inquiry = require("../models/Inquiry");


// ================= DASHBOARD SUMMARY =================
exports.getDashboardStats = async (req, res) => {
  try {
    // Total Students
    const totalStudents = await Student.countDocuments();

    // Total Courses (Active)
    const totalCourses = await Course.countDocuments({ isFinished: false });

    // Total Inquiries
    const totalInquiries = await Inquiry.countDocuments();

    // Converted Inquiries
    const convertedInquiries = await Inquiry.countDocuments({
      status: "converted",
    });

    // Total Revenue (Aggregation)
    const revenueStats = await Payment.aggregate([
      { $match: { status: "success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalRevenue = revenueStats.length > 0 ? revenueStats[0].total : 0;

    // Pending Fees
    const pendingStudents = await Student.countDocuments({
      feeStatus: "pending",
    });

    // Recent Inquiries (Last 5)
    const recentInquiries = await Inquiry.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent Students (Last 5)
    const recentStudents = await Student.find()
      .populate("courses")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalStudents,
        totalCourses,
        totalInquiries,
        convertedInquiries,
        totalRevenue,
        pendingStudents,
        recentInquiries,
        recentStudents,
      },
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMonthlyRevenue = async (req, res) => {
  try {
    const revenue = await Payment.aggregate([
      { $match: { status: "success" } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: revenue,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};