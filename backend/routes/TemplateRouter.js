const express = require('express');
const router = express.Router();
const previewController = require('../controllers/TemplatePreviewController');

// Route to get a single template by ID
router.get("/api/template/:id", previewController.getTemplateById);

// Route to list all templates
router.get("/api/templates", previewController.listTemplates);

module.exports = router;