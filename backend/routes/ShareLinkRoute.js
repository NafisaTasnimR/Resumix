const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/TokenVerification');
const {
  createShareLink,
  getShareLink,
  publicViewHtml,
  publicViewJson
} = require('../controllers/ShareLinkController');

// Owner-only: create or fetch share link for a resume
router.post('/resume/:id/share', verifyToken, createShareLink);
router.get('/resume/:id/share', verifyToken, getShareLink);

// Public (no auth): open the shared resume via token
router.get('/public/resume/:token', publicViewHtml);

// Optional SPA-friendly JSON
router.get('/public/resume/:token/json', publicViewJson);

module.exports = router;
