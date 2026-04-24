const express = require('express');
const router = express.Router();
const { getAllInquiries, createInquiry, getSingleInquiry, updateInquiryStatus, deleteInquiry } = require('../controllers/inquiryController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.post("/", createInquiry); // Public inquiry

// Admin only routes
router.get("/", protect, authorize('admin'), getAllInquiries);
router.get("/:id", protect, authorize('admin'), getSingleInquiry);
router.put("/:id", protect, authorize('admin'), updateInquiryStatus);
router.delete("/:id", protect, authorize('admin'), deleteInquiry);

module.exports = router;
