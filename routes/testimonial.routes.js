const express = require('express');
const router = express.Router();
const controller = require('../controllers/testimonial.controller');
const { protect } = require('../middlewares/auth.middleware');
const authorizeAdmin = require('../middlewares/admin.middleware');
const authorizeStudent = require('../middlewares/student.middleware');

router.get('/approved', controller.getApprovedTestimonials);
router.post('/', protect, authorizeStudent, controller.createTestimonial);

// Admin controls
router.get('/', protect, authorizeAdmin, controller.getAllTestimonials);
router.patch('/:id/approve', protect, authorizeAdmin, controller.toggleApproval);
router.delete('/:id', protect, authorizeAdmin, controller.deleteTestimonial);

module.exports = router;
