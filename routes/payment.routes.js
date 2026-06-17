const express = require('express');
const router = express.Router();
const controller = require('../controllers/payment.controller');
const { protect } = require('../middlewares/auth.middleware');
const authorizeAdmin = require('../middlewares/admin.middleware');

router.post('/checkout', protect, controller.checkout);
router.post('/verify', protect, controller.verifyPayment);
router.get('/history', protect, controller.getPaymentHistory);

// Admin transactions audit log
router.get('/transactions', protect, authorizeAdmin, controller.getTransactions);
router.put('/:id/status', protect, authorizeAdmin, controller.updatePaymentStatus);
router.delete('/:id', protect, authorizeAdmin, controller.deletePayment);

module.exports = router;
