const mongoose = require('mongoose');

const heroSlideSchema = new mongoose.Schema({
  badge: { type: String, default: '' },
  titleStart: { type: String, default: '' },
  titleHighlight: { type: String, default: '' },
  titleEnd: { type: String, default: '' },
  desc: { type: String, default: '' },
  ctaText: { type: String, default: '' },
  ctaLink: { type: String, default: '' },
  glowClass: { type: String, default: 'bg-brand-red/5' }
}, { _id: true });

const SettingsSchema = new mongoose.Schema({
  appName: {
    type: String,
    default: 'English StepUp'
  },
  tagline: {
    type: String,
    default: 'Empowering Growth'
  },
  contactEmail: {
    type: String,
    default: 'info@englishstepup.com'
  },
  contactPhone: {
    type: String,
    default: '+880 1712-345678'
  },
  facebookUrl: {
    type: String,
    default: 'https://facebook.com/englishstepup'
  },
  youtubeUrl: {
    type: String,
    default: 'https://youtube.com/englishstepup'
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  allowTeacherRegistration: {
    type: Boolean,
    default: false
  },
  heroSlides: {
    type: [heroSlideSchema],
    default: [
      {
        badge: 'Welcome To English StepUp',
        titleStart: 'Master English With ',
        titleHighlight: 'Confidence',
        titleEnd: '',
        desc: 'Empowering Growth Through Modern English Learning. Join custom programs designed by industry specialists for children, academic candidates, and professionals.',
        ctaText: 'Get Started',
        ctaLink: '/programs',
        glowClass: 'bg-brand-red/5'
      },
      {
        badge: 'Target High Grades',
        titleStart: 'Ace Your ',
        titleHighlight: 'SSC & HSC',
        titleEnd: ' Examinations',
        desc: 'Secure GPA 5.00 grade targets with modifiers shortcut sheets, tenses drills, past board paper solutions, and regular exam-simulated checks.',
        ctaText: 'Explore Exam Prep',
        ctaLink: '/programs',
        glowClass: 'bg-blue-500/5'
      },
      {
        badge: 'Speak Like a Pro',
        titleStart: 'Communicate ',
        titleHighlight: 'Fluently & Naturally',
        titleEnd: '',
        desc: 'Eradicate conversational fear, neutralize accent barriers, and learn vocabulary in contexts structured for global workplaces.',
        ctaText: 'Join Spoken Course',
        ctaLink: '/programs',
        glowClass: 'bg-emerald-500/5'
      }
    ]
  },
  introVideoUrl: {
    type: String,
    default: 'https://www.w3schools.com/html/mov_bbb.mp4'
  },
  founderQuote: {
    type: String,
    default: 'Our philosophy is simple: language learning should not be boring list cramming. We teach English by communicating, practicing, and building vocabulary in context.'
  },
  founderName: {
    type: String,
    default: 'Ahmed Shahriar'
  },
  founderRole: {
    type: String,
    default: 'Founder & CEO, English StepUp'
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);
