const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctOptionIndex: {
    type: Number,
    required: true
  }
});

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  questions: [QuestionSchema],
  timeLimit: {
    type: Number, // in minutes
    default: 10
  },
  passingScore: {
    type: Number, // in points
    default: 60
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', QuizSchema);
