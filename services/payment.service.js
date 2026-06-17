const Payment = require('../models/Payment');
const Transaction = require('../models/Transaction');

const initializeMockPayment = async (studentId, courseId, amount, gateway = 'bkash', senderNumber = '', couponCode = '') => {
  const trxId = 'TRX-' + gateway.toUpperCase() + '-' + Math.floor(1000000 + Math.random() * 9000000).toString();

  let finalAmount = amount;
  let discountAmount = 0;

  if (couponCode) {
    const Coupon = require('../models/Coupon');
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase().trim() });
    if (coupon && coupon.isActive && (!coupon.expiresAt || new Date() <= coupon.expiresAt) && (coupon.maxUses === 0 || coupon.usedCount < coupon.maxUses) && amount >= coupon.minAmount) {
      if (coupon.discountType === 'percentage') {
        discountAmount = Math.round(amount * (coupon.discountValue / 100));
      } else {
        discountAmount = coupon.discountValue;
      }
      finalAmount = Math.max(0, amount - discountAmount);
      coupon.usedCount += 1;
      await coupon.save();
    }
  }

  // Create payment record in pending state
  const payment = await Payment.create({
    student: studentId,
    course: courseId,
    amount: finalAmount,
    originalAmount: amount,
    paymentMethod: gateway,
    transactionId: trxId,
    senderNumber,
    couponCode: couponCode.toUpperCase().trim(),
    discountAmount,
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
    payment.transactionId = transactionId || payment.transactionId;
    await payment.save();

    await Transaction.findOneAndUpdate(
      { payment: payment._id },
      { status: 'success', transactionId: transactionId || payment.transactionId }
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
      { payment: payment._id },
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
