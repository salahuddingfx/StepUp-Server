const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const { registerValidator, loginValidator, otpValidator, resetPasswordValidator } = require('../validators/auth.validator');
const validate = require('../middlewares/validation.middleware');
const rateLimit = require('../middlewares/rateLimit.middleware');

// Rate limiters: 5 requests per 15 mins
const loginLimiter = rateLimit({ max: 5, message: 'Too many login attempts. Please try again after 15 minutes.' });
const registerLimiter = rateLimit({ max: 5, message: 'Too many registration attempts. Please try again after 15 minutes.' });
const resetPasswordLimiter = rateLimit({ max: 5, message: 'Too many password reset requests. Please try again after 15 minutes.' });

router.post('/register', registerLimiter, registerValidator, validate, controller.register);
router.post('/login', loginLimiter, loginValidator, validate, controller.login);
router.post('/verify-email', otpValidator, validate, controller.verifyEmail);
router.post('/resend-otp', controller.resendOTP);
router.post('/forgot-password', resetPasswordLimiter, controller.forgotPassword);
router.post('/reset-password', resetPasswordLimiter, resetPasswordValidator, validate, controller.resetPassword);
router.post('/refresh-token', controller.refreshToken);
router.post('/logout', controller.logout);

module.exports = router;
