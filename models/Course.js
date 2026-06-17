const mongoose = require('mongoose');

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a course title'],
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  category: {
    type: String,
    enum: ['Kids English', 'Junior English', 'SSC English Preparation', 'HSC English Preparation', 'Spoken English'],
    required: true
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  thumbnail: {
    type: String,
    default: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60'
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Exam Prep'],
    default: 'Beginner'
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  enrollmentsCount: {
    type: Number,
    default: 0
  },
  duration: {
    type: String, // e.g., "12 Weeks", "30 Hours"
    default: '8 Weeks'
  },
  introVideoUrl: {
    type: String,
    default: 'https://www.w3schools.com/html/mov_bbb.mp4'
  },
  outcomes: {
    type: [String],
    default: []
  }
}, { timestamps: true });

CourseSchema.pre('validate', function(next) {
  if (this.title && !this.slug) {
    this.slug = slugify(this.title);
  }
  next();
});

module.exports = mongoose.model('Course', CourseSchema);
