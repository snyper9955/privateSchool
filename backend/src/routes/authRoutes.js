const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword, logout, getProfile, updateProfile, googleCallback, getAllUsers } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const passport = require('passport');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
        const frontendURL = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/+$/, '');
        
        if (err) {
            console.error('Passport Google Auth Error:', err);
            const errMsg = err.message ? encodeURIComponent(err.message) : 'unknown';
            return res.redirect(`${frontendURL}/login?error=internal_auth_error&details=${errMsg}`);
        }
        
        if (!user) {
            return res.redirect(`${frontendURL}/login?error=auth_failed`);
        }
        
        // Log in the user
        req.user = user;
        next();
    })(req, res, next);
}, googleCallback);

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post("/logout", logout);

router.get('/users', protect, authorize('admin'), getAllUsers);

router.route('/profile')
    .get(protect, getProfile)
    .put(protect, updateProfile);



module.exports = router;
