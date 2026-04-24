const express = require('express');
const router = express.Router();
const { getDashboardStats, getMonthlyRevenue } = require('../controllers/dashbord');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.get("/", protect, authorize('admin'), getDashboardStats);
router.get("/monthly-revenue", protect, authorize('admin'), getMonthlyRevenue);

module.exports = router;