const express = require('express');
const router = express.Router();
const { createPayment, getAllPayments, getStudentPayments, updatePaymentStatus, deletePayment, createOrder, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.get("/me/payments", protect, getStudentPayments);

// Razorpay Enrollment Routes
router.post("/order", protect, createOrder);
router.post("/verify", protect, verifyPayment);

// Admin only routes
router.post("/", protect, authorize('admin'), createPayment);
router.get("/", protect, authorize('admin'), getAllPayments);
router.get("/student/:studentId", protect, authorize('admin'), getStudentPayments);
router.put("/:id", protect, authorize('admin'), updatePaymentStatus);
router.delete("/:id", protect, authorize('admin'), deletePayment);

module.exports = router;
