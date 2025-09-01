const fs = require('fs');
const path = require('path');
const { prepareTemplateHtml } = require('../services/TemplateRenderService');

// Controller to get a single template by ID
exports.getTemplatePartsById = (req, res) => {
  fs.readFile(`./templates/${req.params.id}.html`, "utf8", (err, data) => {
    if (err) return res.status(500).send("Template not found");
    //res.send(data);
    const styleMatch = data.match(/<style[^>]*>([\s\S]*?)<\/style>/);
    const bodyMatch = data.match(/<body[^>]*>([\s\S]*?)<\/body>/);

    const templateCss = styleMatch ? styleMatch[1] : "";
    const rawTemplate = bodyMatch ? bodyMatch[1] : "";

    res.json({
      rawTemplate,
      templateCss,
      templateName: `Template ${req.params.id}`
    });

  });
};

exports.getTemplateById = (req, res) => {
  fs.readFile(`./templates/${req.params.id}.html`, "utf8", (err, data) => {
    if (err) return res.status(500).send("Template not found");
    res.send(data);
  });
};

// Controller to list all templates
exports.listTemplates = (req, res) => {
  const templatesDir = path.join(__dirname, '../templates');

  fs.readdir(templatesDir, (err, files) => {
    if (err) return res.status(500).send("Cannot read templates folder");

    // Only pick HTML files, map to ids
    const templates = files
      .filter(file => file.endsWith('.html'))
      .map(file => {
        const id = path.parse(file).name;
        return {
          id: id,
          name: `Template ${id}`,
          url: `/api/template/${id}`
        };
      });

    res.json(templates);
  });
};

exports.previewProcessedTemplate = async (req, res) => {
  try {
    const { id } = req.params;          // template id (filename without .html)
    const resumeData = req.body || {};  // pass the user’s ResumeData in request body
    const { finalHtml } = await prepareTemplateHtml(id, resumeData, id);
    res.status(200).type('text/html').send(finalHtml);
  } catch (e) {
    console.error(e);
    res.status(500).send('Failed to build processed preview');
  }
};