const express = require('express');
const router = express.Router();
const { 
    createTopper, 
    getToppers, 
    updateTopper, 
    deleteTopper 
} = require('../controllers/topperController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Public route to get toppers
router.get('/', getToppers);

// Private/Admin routes
router.post('/', protect, authorize('admin'), upload.single('image'), createTopper);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updateTopper);
router.delete('/:id', protect, authorize('admin'), deleteTopper);

module.exports = router;
