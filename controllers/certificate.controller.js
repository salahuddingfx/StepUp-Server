const Certificate = require('../models/Certificate');
const { issueCertificate } = require('../services/certificate.service');

// Get all certificates (Admin dashboard view)
exports.getAllCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find().populate('student', 'name email').populate('course', 'title');
    res.status(200).json({ success: true, count: certificates.length, certificates });
  } catch (error) {
    next(error);
  }
};

// Get student certificate details
exports.getCertificateById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const certificate = await Certificate.findById(id)
      .populate('student', 'name email')
      .populate('course', 'title category duration');

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    res.status(200).json({ success: true, certificate });
  } catch (error) {
    next(error);
  }
};

// Manual trigger to issue certificate (Admin/Teacher only)
exports.generateCertificate = async (req, res, next) => {
  const { studentId, courseId } = req.body;

  try {
    const cert = await issueCertificate(studentId, courseId);
    res.status(201).json({
      success: true,
      message: 'Certificate issued successfully',
      certificate: cert
    });
  } catch (error) {
    next(error);
  }
};
