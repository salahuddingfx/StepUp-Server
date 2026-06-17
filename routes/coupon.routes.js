const express = require('express');
const router = express.Router();
const controller = require('../controllers/coupon.controller');
const { protect } = require('../middlewares/auth.middleware');
const authorizeAdmin = require('../middlewares/admin.middleware');

router.post('/validate', protect, controller.validateCoupon);
router.get('/', protect, authorizeAdmin, controller.getCoupons);
router.get('/:id', protect, authorizeAdmin, controller.getCoupon);
router.post('/', protect, authorizeAdmin, controller.createCoupon);
router.put('/:id', protect, authorizeAdmin, controller.updateCoupon);
router.delete('/:id', protect, authorizeAdmin, controller.deleteCoupon);

module.exports = router;
