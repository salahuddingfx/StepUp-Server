const Payment = require('../models/Payment');
const Transaction = require('../models/Transaction');
const Student = require('../models/Student');
const { initializeMockPayment, verifyMockPayment } = require('../services/payment.service');

// Initialize payment
exports.checkout = async (req, res, next) => {
  const { courseId, amount, gateway } = req.body;

  try {
    const session = await initializeMockPayment(req.user.id, courseId, amount, gateway);
    res.status(200).json(session);
  } catch (error) {
    next(error);
  }
};

// Verify payment hook
exports.verifyPayment = async (req, res, next) => {
  const { paymentId, transactionId, status } = req.body;

  try {
    const result = await verifyMockPayment(paymentId, transactionId, status);
    
    // Automatically enroll student in course if payment succeeded
    if (result.success) {
      const student = await Student.findOne({ user: result.payment.student });
      if (student) {
        const alreadyEnrolled = student.coursesEnrolled.some(
          c => c.course.toString() === result.payment.course.toString()
        );
        if (!alreadyEnrolled) {
          student.coursesEnrolled.push({
            course: result.payment.course,
            progress: 0,
            completedLessons: []
          });
          await student.save();
        }
      }
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Get checkout history (Admin or Student self list)
exports.getPaymentHistory = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { student: req.user.id };
    const payments = await Payment.find(filter)
      .populate('student', 'name email')
      .populate('course', 'title price')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: payments.length, payments });
  } catch (error) {
    next(error);
  }
};

// Get transactions log (Admin only)
exports.getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find()
      .populate('student', 'name email')
      .sort('-createdAt');
      
    res.status(200).json({ success: true, count: transactions.length, transactions });
  } catch (error) {
    next(error);
  }
};

// Admin: Update Payment Status (Approve/Reject)
exports.updatePaymentStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body; // completed, failed, pending

  try {
    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    payment.status = status;
    await payment.save();

    // If manually completed, enroll student in the course
    if (status === 'completed') {
      const student = await Student.findOne({ user: payment.student });
      if (student) {
        const alreadyEnrolled = student.coursesEnrolled.some(
          c => c.course.toString() === payment.course.toString()
        );
        if (!alreadyEnrolled) {
          student.coursesEnrolled.push({
            course: payment.course,
            progress: 0,
            completedLessons: []
          });
          await student.save();
        }
      }
    }

    res.status(200).json({
      success: true,
      message: `Payment status updated to ${status}`,
      payment
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete Payment Record
exports.deletePayment = async (req, res, next) => {
  const { id } = req.params;

  try {
    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    await Payment.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Payment record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
