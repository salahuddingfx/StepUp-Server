const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  content: {
    type: String // Markdown or text content
  },
  videoUrl: {
    type: String // Cloudinary, YouTube, or Vimeo URL
  },
  duration: {
    type: String, // e.g. "45 mins"
    default: '30 mins'
  },
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  pdfNotesUrl: {
    type: String // PDF file upload path
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Lesson', LessonSchema);
