const { uploadToCloudinary, isConfigured } = require('../config/cloudinary.config');
const fs = require('fs');

const uploadFile = async (file, folder = 'english_stepup') => {
  if (!file) {
    throw new Error('Please select a file to upload');
  }

  try {
    const result = await uploadToCloudinary(file.path, folder);
    
    // Clean up local temp file synchronously
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    
    return result;
  } catch (error) {
    console.error('File upload service error:', error);
    // Remove local temp file on error
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    throw error;
  }
};

module.exports = {
  uploadFile,
  isConfigured
};
