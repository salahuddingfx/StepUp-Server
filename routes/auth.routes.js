const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const { registerValidator, loginValidator, otpValidator, resetPasswordValidator } = require('../validators/auth.validator');
const validate = require('../middlewares/validation.middleware');

router.post('/register', registerValidator, validate, controller.register);
router.post('/login', loginValidator, validate, controller.login);
router.post('/verify-email', otpValidator, validate, controller.verifyEmail);
router.post('/resend-otp', controller.resendOTP);
router.post('/forgot-password', controller.forgotPassword);
router.post('/reset-password', resetPasswordValidator, validate, controller.resetPassword);
router.post('/refresh-token', controller.refreshToken);
router.post('/logout', controller.logout);

module.exports = router;
