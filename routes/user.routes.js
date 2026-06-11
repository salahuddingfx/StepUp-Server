const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');
const authorizeAdmin = require('../middlewares/admin.middleware');

router.get('/profile', protect, controller.getProfile);
router.put('/profile', protect, controller.updateProfile);

// Admin-only user list and control
router.get('/', protect, authorizeAdmin, controller.getAllUsers);
router.patch('/:id/toggle-status', protect, authorizeAdmin, controller.toggleUserStatus);
router.delete('/:id', protect, authorizeAdmin, controller.deleteUser);

module.exports = router;
