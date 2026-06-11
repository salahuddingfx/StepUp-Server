const express = require('express');
const router = express.Router();
const controller = require('../controllers/notification.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/', protect, controller.getNotifications);
router.patch('/read-all', protect, controller.markAllAsRead);
router.patch('/:id/read', protect, controller.markAsRead);

module.exports = router;
