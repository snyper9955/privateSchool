const Notice = require('../models/Notice');

// @desc    Create a new notice
// @route   POST /api/notices
// @access  Private/Admin
exports.createNotice = async (req, res) => {
    try {
        req.body.createdBy = req.user.id;
        const notice = await Notice.create(req.body);
        res.status(201).json({ success: true, data: notice });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get all active notices (for students/public)
// @route   GET /api/notices
// @access  Public
exports.getNotices = async (req, res) => {
    try {
        const notices = await Notice.find({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: notices.length, data: notices });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get all notices (for admin management)
// @route   GET /api/notices/admin
// @access  Private/Admin
exports.getAllNotices = async (req, res) => {
    try {
        const notices = await Notice.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: notices.length, data: notices });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update a notice
// @route   PUT /api/notices/:id
// @access  Private/Admin
exports.updateNotice = async (req, res) => {
    try {
        const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!notice) {
            return res.status(404).json({ success: false, message: 'Notice not found' });
        }

        res.status(200).json({ success: true, data: notice });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete a notice
// @route   DELETE /api/notices/:id
// @access  Private/Admin
exports.deleteNotice = async (req, res) => {
    try {
        const notice = await Notice.findByIdAndDelete(req.params.id);

        if (!notice) {
            return res.status(404).json({ success: false, message: 'Notice not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
