const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  instructions: {
    type: String,
    required: true
  },
  maxPoints: {
    type: Number,
    default: 100
  },
  fileUrl: {
    type: String // Optional reference PDF or document
  },
  dueDate: {
    type: Date,
    required: true
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Assignment', AssignmentSchema);
