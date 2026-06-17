const express = require('express');
const router = express.Router();
const controller = require('../controllers/certificate.controller');
const { protect } = require('../middlewares/auth.middleware');
const authorizeTeacher = require('../middlewares/teacher.middleware');
const authorizeAdmin = require('../middlewares/admin.middleware');

router.get('/', protect, authorizeAdmin, controller.getAllCertificates);
router.get('/my', protect, controller.getMyCertificates);
router.get('/:id', protect, controller.getCertificateById);
router.post('/issue', protect, authorizeTeacher, controller.generateCertificate);
router.delete('/:id', protect, authorizeAdmin, controller.deleteCertificate);

module.exports = router;
