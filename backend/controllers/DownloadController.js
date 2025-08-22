// controllers/resume.controller.js
const fs = require('fs/promises');
const path = require('path');
const puppeteer = require('puppeteer');
const Resume = require('../models/Resume'); // must contain { userId, templateId (or templateSlug), ResumeData }

const TEMPLATES_DIR = path.resolve(process.cwd(), 'templates');

// ===== Helpers =====
const getProp = (obj, p) =>
    p.split('.').reduce((o, k) => (o != null ? o[k] : undefined), obj);

function fillTemplate(raw, data) {
    return raw.replace(/{{\s*([^}]+)\s*}}/g, (_, key) => {
        const normalized = key.replace(/\[(\d+)\]/g, '.$1'); // arr[0] -> arr.0
        const v = getProp(data, normalized);
        return v == null ? '' : String(v);
    });
}

/**
 * Read ./templates/<id>.html and extract:
 *  - <style> ... </style>  -> templateCss
 *  - <body>  ... </body>   -> rawTemplate
 * Mirrors your TemplatePreviewController logic for consistency.
 */
async function readTemplatePartsById(id) {
    const htmlPath = path.join(TEMPLATES_DIR, `${id}.html`);
    const html = await fs.readFile(htmlPath, 'utf8');

    const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/);
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);

    const templateCss = styleMatch ? styleMatch[1] : '';
    const rawTemplate = bodyMatch ? bodyMatch[1] : html; // fallback if body tag not found

    return { templateCss, rawTemplate };
}

// ===== Controller =====
const downloadResumePdf = async (req, res) => {
    try {
        // 1) Load resume & authorize
        const resume = await Resume.findById(req.params.id).lean();
        if (!resume) return res.status(404).send('Resume not found');
        if (String(resume.userId) !== String(req.user._id)) {
            return res.status(403).send('Not allowed');
        }

        // 2) Load template from filesystem using the same convention as your preview routes
        //    Expect resume.templateId (or templateSlug) to match "<id>.html" under /templates
        const slug = resume.templateId || resume.templateSlug;
        if (!slug) return res.status(400).send('Template id/slug missing on resume');

        const { templateCss, rawTemplate } = await readTemplatePartsById(slug);

        // 3) Fill placeholders with resume data
        const filledBody = fillTemplate(rawTemplate, resume.ResumeData || {});

        // 4) Wrap in print-safe HTML (A4) and inline the template CSS
        const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    @page { size: A4; margin: 20mm; }
    html, body { padding: 0; margin: 0; }
    .a4-sheet { width: 210mm; min-height: 297mm; box-sizing: border-box; }
    ${templateCss}
  </style>
</head>
<body>
  <div class="a4-sheet">
    ${filledBody}
  </div>
</body>
</html>`;

        // 5) Render to PDF
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--font-render-hinting=medium'],
        });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: ['domcontentloaded', 'networkidle0'] });
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            preferCSSPageSize: true,
        });
        await browser.close();

        // 6) Send file
        const filename = `${(resume.title || 'resume').replace(/[^\w\-]+/g, '_')}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        return res.status(200).send(pdfBuffer);
    } catch (err) {
        console.error(err);
        return res.status(500).send('Failed to generate PDF');
    }
};

module.exports = {
    downloadResumePdf,
};
