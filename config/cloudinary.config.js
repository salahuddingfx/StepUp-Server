const cloudinary = require('cloudinary').v2;

const isConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                    process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name';

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
} else {
  console.warn('Cloudinary is not configured. Media uploads will fall back to local mocks.');
}

const uploadToCloudinary = async (filePath, folder = 'english_stepup') => {
  if (isConfigured) {
    try {
      const result = await cloudinary.uploader.upload(filePath, { folder });
      return { url: result.secure_url, public_id: result.public_id };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  } else {
    // Local development mock URL
    console.log(`Mock Uploading ${filePath} to Cloudinary folder ${folder}`);
    return { 
      url: `https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60`, 
      public_id: 'mock_public_id_' + Date.now() 
    };
  }
};

module.exports = { cloudinary, uploadToCloudinary, isConfigured };
