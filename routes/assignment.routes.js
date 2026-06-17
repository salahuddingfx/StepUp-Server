const express = require('express');
const router = express.Router();
const controller = require('../controllers/assignment.controller');
const { protect } = require('../middlewares/auth.middleware');
const authorizeTeacher = require('../middlewares/teacher.middleware');
const authorizeStudent = require('../middlewares/student.middleware');

router.post('/', protect, authorizeTeacher, controller.createAssignment);
router.delete('/:id', protect, authorizeTeacher, controller.deleteAssignment);
router.post('/submit', protect, authorizeStudent, controller.submitAssignment);
router.post('/grade', protect, authorizeTeacher, controller.gradeSubmission);
router.get('/submission/:assignmentId', protect, authorizeTeacher, controller.getSubmissions);

module.exports = router;
