const express = require('express');
const router = express.Router();
const { 
    createNotice, 
    getNotices, 
    getAllNotices, 
    updateNotice, 
    deleteNotice 
} = require('../controllers/noticeController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// Public route to get active notices
router.get('/', getNotices);

// Private/Admin routes
router.post('/', protect, authorize('admin'), createNotice);
router.get('/admin', protect, authorize('admin'), getAllNotices);
router.put('/:id', protect, authorize('admin'), updateNotice);
router.delete('/:id', protect, authorize('admin'), deleteNotice);

module.exports = router;
