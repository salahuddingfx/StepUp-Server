const express = require('express');
const router = express.Router();
const controller = require('../controllers/quiz.controller');
const { protect } = require('../middlewares/auth.middleware');
const authorizeTeacher = require('../middlewares/teacher.middleware');
const authorizeStudent = require('../middlewares/student.middleware');

router.route('/')
  .post(protect, authorizeTeacher, controller.createQuiz)
  .get(protect, authorizeTeacher, controller.getQuizzes);

router.get('/:id', protect, controller.getQuizById);
router.delete('/:id', protect, authorizeTeacher, controller.deleteQuiz);
router.post('/submit', protect, authorizeStudent, controller.submitQuiz);

module.exports = router;
