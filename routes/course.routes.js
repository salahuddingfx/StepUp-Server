const express = require('express');
const router = express.Router();
const controller = require('../controllers/course.controller');
const { protect } = require('../middlewares/auth.middleware');
const authorizeTeacher = require('../middlewares/teacher.middleware');
const authorizeAdmin = require('../middlewares/admin.middleware');
const { courseValidator } = require('../validators/course.validator');
const validate = require('../middlewares/validation.middleware');

router.get('/', controller.getCourses);
router.get('/:id', controller.getCourseById);

router.post('/', protect, authorizeTeacher, courseValidator, validate, controller.createCourse);
router.put('/:id', protect, authorizeTeacher, courseValidator, validate, controller.updateCourse);
router.patch('/:id/publish', protect, authorizeTeacher, controller.togglePublish);
router.delete('/:id', protect, authorizeAdmin, controller.deleteCourse);

module.exports = router;
