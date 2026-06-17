const mongoose = require('mongoose');

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
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);
