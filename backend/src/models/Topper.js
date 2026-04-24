const mongoose = require('mongoose');

const topperSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add student name'],
        trim: true
    },
    course: {
        type: String, // Can be course name or reference
        required: [true, 'Please add course name']
    },
    rank: {
        type: String, // e.g. "AIR 1", "99.5%", "District Topper"
        required: [true, 'Please add rank or score']
    },
    year: {
        type: String,
        required: [true, 'Please add year']
    },
    image: {
        type: String // URL to profile photo
    },
    message: {
        type: String // Testimonial from the student
    },
    
    isFeatured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Topper', topperSchema);
