const Certificate = require('../models/Certificate');
const User = require('../models/User');
const Course = require('../models/Course');

const generateCertificateHTML = (studentName, courseTitle, certId, issueDate, grade) => {
  const dateStr = new Date(issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  return `
    <div style="width:800px;height:600px;background:linear-gradient(135deg,#fef9ef,#fef3e2);border:12px solid #dc2626;border-radius:24px;padding:40px;box-sizing:border-box;font-family:Georgia,'Times New Roman',serif;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;position:relative;">
      <div style="position:absolute;top:20px;left:50%;transform:translateX(-50%);width:100px;height:4px;background:linear-gradient(90deg,transparent,#dc2626,transparent);border-radius:2px;"></div>
      <div style="font-size:14px;letter-spacing:6px;color:#9ca3af;text-transform:uppercase;font-weight:bold;margin-bottom:8px;">Certificate of Completion</div>
      <div style="font-size:40px;color:#dc2626;margin:4px 0;">&#9733;</div>
      <div style="font-size:13px;color:#6b7280;margin-bottom:16px;">This certifies that</div>
      <div style="font-size:32px;font-weight:bold;color:#111827;margin-bottom:8px;">${studentName}</div>
      <div style="font-size:14px;color:#6b7280;margin-bottom:20px;">has successfully completed the course</div>
      <div style="font-size:22px;font-weight:bold;color:#dc2626;margin-bottom:24px;border-bottom:2px solid #fecaca;padding-bottom:12px;">${courseTitle}</div>
      <div style="display:flex;justify-content:center;gap:48px;font-size:13px;color:#6b7280;margin-bottom:20px;">
        <div><div style="font-weight:bold;color:#111827;">Certificate ID</div>${certId}</div>
        <div><div style="font-weight:bold;color:#111827;">Grade</div>${grade}</div>
        <div><div style="font-weight:bold;color:#111827;">Issue Date</div>${dateStr}</div>
      </div>
      <div style="margin-top:auto;padding-top:16px;border-top:1px solid #e5e7eb;width:100%;display:flex;justify-content:space-between;font-size:11px;color:#9ca3af;">
        <span>English StepUp</span>
        <span>Empowering Growth</span>
      </div>
    </div>
  `;
};

const issueCertificate = async (studentId, courseId) => {
  const existingCert = await Certificate.findOne({ student: studentId, course: courseId });
  if (existingCert) {
    return existingCert;
  }

  const user = await User.findById(studentId);
  const course = await Course.findById(courseId);
  if (!user || !course) {
    throw new Error('User or Course not found');
  }

  const certId = 'CERT-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
  const studentName = user.name;
  const courseTitle = course.title;
  const grade = 'A+';

  const html = generateCertificateHTML(studentName, courseTitle, certId, new Date(), grade);
  const pdfUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);

  const certificate = await Certificate.create({
    student: studentId,
    course: courseId,
    certificateId: certId,
    studentName,
    courseTitle,
    grade,
    pdfUrl
  });

  return certificate;
};

module.exports = { issueCertificate, generateCertificateHTML };
