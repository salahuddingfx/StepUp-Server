const Certificate = require('../models/Certificate');

const issueCertificate = async (studentId, courseId) => {
  // Check if certificate already exists
  const existingCert = await Certificate.findOne({ student: studentId, course: courseId });
  if (existingCert) {
    return existingCert;
  }

  // Generate a unique Certificate ID
  const certId = 'CERT-' + Math.floor(100000 + Math.random() * 900000).toString() + '-' + Date.now().toString().slice(-4);

  // Mock certificate PDF generation url
  const pdfUrl = `https://images.unsplash.com/photo-1589330694653-ded6df53f7ec?w=1000&auto=format&fit=crop&q=80`;

  const certificate = await Certificate.create({
    student: studentId,
    course: courseId,
    certificateId: certId,
    pdfUrl
  });

  return certificate;
};

module.exports = {
  issueCertificate
};
