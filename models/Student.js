const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  studentId: {
    type: String,
    unique: true,
    sparse: true
  },
  targetClass: {
    type: String,
    enum: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'SSC Candidate', 'HSC Candidate', 'Spoken English Learner'],
    required: true
  },
  coursesEnrolled: [{
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    enrolledAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 }, // percentage
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }]
  }],
  quizzesTaken: [{
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    score: Number,
    totalPoints: Number,
    passed: Boolean,
    takenAt: { type: Date, default: Date.now }
  }],
  assignmentsSubmitted: [{
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
    submittedFile: String,
    status: { type: String, enum: ['pending', 'graded'], default: 'pending' },
    grade: String,
    score: Number,
    submittedAt: { type: Date, default: Date.now }
  }],
  attendance: [{
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['present', 'absent'], default: 'present' }
  }]
}, { timestamps: true });

StudentSchema.pre('save', async function(next) {
  if (this.isNew && !this.studentId) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Student').countDocuments();
    this.studentId = `STU-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Student', StudentSchema);
