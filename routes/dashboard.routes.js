const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboard.controller');
const { protect } = require('../middlewares/auth.middleware');
const authorizeAdmin = require('../middlewares/admin.middleware');

router.get('/stats', protect, authorizeAdmin, controller.getAdminStats);

module.exports = router;
