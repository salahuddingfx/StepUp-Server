const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const { uploadFile } = require('../services/cloudinary.service');
const { protect } = require('../middlewares/auth.middleware');

// POST /api/v1/upload - Upload any allowed file type (image, video, pdf, doc) to Cloudinary
router.post('/', protect, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Determine folder from request body, default to 'english_stepup'
    const folder = req.body.folder || 'english_stepup';
    
    // Upload the file to Cloudinary and clean up local temp file
    const result = await uploadFile(req.file, folder);

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully to Cloudinary',
      url: result.url,
      public_id: result.public_id
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
