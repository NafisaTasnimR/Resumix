const express = require('express');
const router = express.Router();
const previewController = require('../controllers/TemplatePreviewController');

// Route to get a single template by ID
router.get("/api/template/:id", previewController.getTemplateById);

router.get("/api/template/parts/:id", previewController.getTemplatePartsById);

// Route to list all templates
router.get("/api/templates", previewController.listTemplates);

router.post("/api/template/preview/:id", previewController.previewProcessedTemplate);

module.exports = router;