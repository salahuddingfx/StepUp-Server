const Payment = require('../models/Payment');
const Transaction = require('../models/Transaction');

const initializeMockPayment = async (studentId, courseId, amount, gateway = 'bkash') => {
  const trxId = 'TRX-' + gateway.toUpperCase() + '-' + Math.floor(1000000 + Math.random() * 9000000).toString();

  // Create payment record in pending state
  const payment = await Payment.create({
    student: studentId,
    course: courseId,
    amount,
    paymentMethod: gateway,
    transactionId: trxId,
    status: 'pending'
  });

  // Log transaction initiation
  await Transaction.create({
    payment: payment._id,
    student: studentId,
    amount,
    transactionId: trxId,
    paymentMethod: gateway,
    status: 'initiated'
  });

  return {
    success: true,
    paymentId: payment._id,
    transactionId: trxId,
    redirectUrl: `/checkout/verify?paymentId=${payment._id}&trxId=${trxId}&gateway=${gateway}`
  };
};

const verifyMockPayment = async (paymentId, transactionId, status = 'success') => {
  const payment = await Payment.findById(paymentId);
  if (!payment) {
    throw new Error('Payment record not found');
  }

  if (status === 'success') {
    payment.status = 'completed';
    await payment.save();

    await Transaction.findOneAndUpdate(
      { transactionId },
      { status: 'success' }
    );

    return {
      success: true,
      message: 'Payment completed successfully',
      payment
    };
  } else {
    payment.status = 'failed';
    await payment.save();

    await Transaction.findOneAndUpdate(
      { transactionId },
      { status: 'failed' }
    );

    return {
      success: false,
      message: 'Payment failed or cancelled',
      payment
    };
  }
};

module.exports = {
  initializeMockPayment,
  verifyMockPayment
};
