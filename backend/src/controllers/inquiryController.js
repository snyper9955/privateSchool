const Inquiry = require("../models/Inquiry");


// ================= CREATE INQUIRY =================
exports.createInquiry = async (req, res) => {
  try {
    const { name, phone, message, courseInterested } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name and Phone are required",
      });
    }

    const inquiry = await Inquiry.create({
      name,
      phone,
      message,
      courseInterested,
    });

    res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully",
      data: inquiry,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ================= GET ALL INQUIRIES =================
exports.getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .populate("courseInterested")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ================= GET SINGLE INQUIRY =================
exports.getSingleInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate("courseInterested");

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    res.json({
      success: true,
      data: inquiry,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ================= UPDATE INQUIRY STATUS =================
exports.updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    res.json({
      success: true,
      message: "Inquiry status updated",
      data: inquiry,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ================= DELETE INQUIRY =================
exports.deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    res.json({
      success: true,
      message: "Inquiry deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};