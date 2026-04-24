const express = require('express');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
require('./config/passport'); // Initialize Passport Config

const app = express();

// Global Middleware
app.use(cors({
    origin: [
        process.env.FRONTEND_URL, // Render will use this for your Vercel URL
        "http://localhost:5173", 
        "http://127.0.0.1:5173", 
        "https://coaching-nine-nu.vercel.app",
        /\.vercel\.app$/
    ],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/inquiries', require('./routes/inquiryRoutes'));
app.use('/api/dashboard', require('./routes/DashbordRoute'));
app.use('/api/notices', require('./routes/noticeRoutes'));
app.use('/api/toppers', require('./routes/topperRoutes'));

module.exports = app;