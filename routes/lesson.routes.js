const express = require('express');
const router = express.Router();
const controller = require('../controllers/lesson.controller');
const { protect } = require('../middlewares/auth.middleware');
const authorizeTeacher = require('../middlewares/teacher.middleware');

router.post('/module', protect, authorizeTeacher, controller.createModule);

router.post('/', protect, authorizeTeacher, controller.createLesson);
router.get('/:id', protect, controller.getLessonById);
router.put('/:id', protect, authorizeTeacher, controller.updateLesson);
router.delete('/:id', protect, authorizeTeacher, controller.deleteLesson);

module.exports = router;
