const express = require('express');
const router = express.Router();
const controller = require('../controllers/teacher.controller');
const { protect } = require('../middlewares/auth.middleware');
const authorizeTeacher = require('../middlewares/teacher.middleware');
const authorizeAdmin = require('../middlewares/admin.middleware');

router.get('/', controller.getAllTeachers);
router.get('/:id', controller.getTeacherById);
router.put('/profile', protect, authorizeTeacher, controller.updateTeacherProfile);

// Admin status approvals
router.patch('/:id/status', protect, authorizeAdmin, controller.updateTeacherStatus);

module.exports = router;
