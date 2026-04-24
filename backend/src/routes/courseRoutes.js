const express = require('express');
const router = express.Router();
const {
    createCourse,
    getAllCourses,
    updateCourse,
    deleteCourse,
    getCourseById,
} = require("../controllers/courseController");

const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");

router.post("/create", protect, authorize('admin'), createCourse);
router.get("/", getAllCourses);
router.get("/:id", getCourseById);
router.put("/:id", protect, authorize('admin'), updateCourse);
router.delete("/:id", protect, authorize('admin'), deleteCourse);

module.exports = router;
