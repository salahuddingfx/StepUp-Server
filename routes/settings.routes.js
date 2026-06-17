const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settings.controller');
const { protect } = require('../middlewares/auth.middleware');
const authorizeAdmin = require('../middlewares/admin.middleware');

router.route('/')
  .get(getSettings)
  .put(protect, authorizeAdmin, updateSettings);

module.exports = router;
