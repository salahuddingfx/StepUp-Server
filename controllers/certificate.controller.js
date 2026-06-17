const Certificate = require('../models/Certificate');
const { issueCertificate } = require('../services/certificate.service');

exports.getAllCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find().populate('student', 'name email').populate('course', 'title').sort('-issueDate');
    res.status(200).json({ success: true, count: certificates.length, certificates });
  } catch (error) {
    next(error);
  }
};

exports.getMyCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find({ student: req.user.id }).populate('course', 'title category').sort('-issueDate');
    res.status(200).json({ success: true, count: certificates.length, certificates });
  } catch (error) {
    next(error);
  }
};

exports.getCertificateById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const certificate = await Certificate.findById(id).populate('student', 'name email').populate('course', 'title category duration');
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }
    res.status(200).json({ success: true, certificate });
  } catch (error) {
    next(error);
  }
};

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

exports.deleteCertificate = async (req, res, next) => {
  try {
    const cert = await Certificate.findByIdAndDelete(req.params.id);
    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }
    res.status(200).json({ success: true, message: 'Certificate deleted successfully' });
  } catch (error) {
    next(error);
  }
};
