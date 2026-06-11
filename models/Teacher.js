const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bio: {
    type: String,
    trim: true,
    default: 'English Instructor at English StepUp.'
  },
  expertise: [{
    type: String
  }],
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },
  coursesAssigned: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  rating: {
    type: Number,
    default: 4.8
  }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', TeacherSchema);
