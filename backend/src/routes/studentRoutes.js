const express = require('express');
const router = express.Router();
const { 
    getAllStudents, 
    updateStudent, 
    deleteStudent, 
    registerStudent, 
    getSingleStudent,
    getStudentDashboardData 
} = require('../controllers/studentController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.get("/me/dashboard", protect, getStudentDashboardData);

// Admin only routes
router.post("/register", protect, authorize('admin'), registerStudent);
router.get("/", protect, authorize('admin'), getAllStudents);
router.get("/:id", protect, authorize('admin'), getSingleStudent);
router.put("/:id", protect, authorize('admin'), updateStudent);
router.delete("/:id", protect, authorize('admin'), deleteStudent);

module.exports = router;
