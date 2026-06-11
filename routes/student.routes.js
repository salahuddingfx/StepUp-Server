const express = require('express');
const router = express.Router();
const controller = require('../controllers/student.controller');
const { protect } = require('../middlewares/auth.middleware');
const authorizeStudent = require('../middlewares/student.middleware');
const authorizeAdmin = require('../middlewares/admin.middleware');

router.get('/dashboard', protect, authorizeStudent, controller.getDashboard);
router.post('/enroll', protect, authorizeStudent, controller.enrollInCourse);
router.post('/progress', protect, authorizeStudent, controller.updateProgress);

// Admin / Teacher can log attendance
router.post('/attendance', protect, controller.logAttendance);

module.exports = router;
