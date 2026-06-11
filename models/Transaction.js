const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  paymentMethod: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['initiated', 'success', 'failed'],
    default: 'initiated'
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
