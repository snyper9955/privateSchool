const Topper = require('../models/Topper');

// @desc    Add a new topper
// @route   POST /api/toppers
// @access  Private/Admin
exports.createTopper = async (req, res) => {
    try {
        const topperData = { ...req.body };
        
        // Handle file upload
        if (req.file) {
            // Store relative path for frontend access
            topperData.image = `/uploads/toppers/${req.file.filename}`;
        }

        const topper = await Topper.create(topperData);
        res.status(201).json({ success: true, data: topper });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get all toppers
// @route   GET /api/toppers
// @access  Public
exports.getToppers = async (req, res) => {
    try {
        const toppers = await Topper.find().sort({ year: -1, createdAt: -1 });
        res.status(200).json({ success: true, count: toppers.length, data: toppers });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update topper details
// @route   PUT /api/toppers/:id
// @access  Private/Admin
exports.updateTopper = async (req, res) => {
    try {
        const topperData = { ...req.body };

        // Handle file upload
        if (req.file) {
            topperData.image = `/uploads/toppers/${req.file.filename}`;
        }

        const topper = await Topper.findByIdAndUpdate(req.params.id, topperData, {
            new: true,
            runValidators: true
        });

        if (!topper) {
            return res.status(404).json({ success: false, message: 'Topper not found' });
        }

        res.status(200).json({ success: true, data: topper });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete a topper
// @route   DELETE /api/toppers/:id
// @access  Private/Admin
exports.deleteTopper = async (req, res) => {
    try {
        const topper = await Topper.findByIdAndDelete(req.params.id);

        if (!topper) {
            return res.status(404).json({ success: false, message: 'Topper not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
