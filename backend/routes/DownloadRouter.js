// routes/resume.routes.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/TokenVerification');
const { downloadResumePdf } = require('../controllers/DownloadController');

// Reuse your existing /api base (same style as TemplateRouter)
router.get('/resume/:id/pdf', verifyToken, downloadResumePdf);

module.exports = router;
