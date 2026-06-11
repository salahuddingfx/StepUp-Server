const express = require('express');
const router = express.Router();
const controller = require('../controllers/blog.controller');
const { protect } = require('../middlewares/auth.middleware');
const authorizeTeacher = require('../middlewares/teacher.middleware');

router.get('/', controller.getBlogs);
router.get('/:slug', controller.getBlogBySlug);

router.post('/', protect, authorizeTeacher, controller.createBlog);
router.put('/:id', protect, authorizeTeacher, controller.updateBlog);
router.delete('/:id', protect, authorizeTeacher, controller.deleteBlog);

module.exports = router;
