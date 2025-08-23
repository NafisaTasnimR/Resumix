// controllers/resume.controller.js
const puppeteer = require('puppeteer');
const Resume = require('../models/Resume');
const { prepareTemplateHtml } = require('../services/TemplateRenderService');

// (Optional) reuse a single browser for performance
let browserPromise;
async function getBrowser() {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--font-render-hinting=medium'],
    });
  }
  return browserPromise;
}

const downloadResumePdf = async (req, res) => {
  let page;
  try {
    // 1) Load resume & authorize
    const resume = await Resume.findById(req.params.id).lean();
    if (!resume) return res.status(404).send('Resume not found');
    if (String(resume.userId) !== String(req.user._id)) {
      return res.status(403).send('Not allowed');
    }

    // 2) Determine template identifier (matches your /templates/<id>.html)
    const templateId = resume.templateId || resume.templateSlug;
    if (!templateId) return res.status(400).send('Template id/slug missing on resume');

    const { finalHtml } = await prepareTemplateHtml(
      templateId,
      resume.ResumeData || {},
      templateId // used to make the scope class unique per template
    );

    // 4) Render to PDF with Puppeteer
    const browser = await getBrowser();
    page = await browser.newPage();
    await page.emulateMediaType('print'); // use screen styles; printBackground handles colors
    await page.setContent(finalHtml, { waitUntil: ['domcontentloaded', 'networkidle0'] });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
    });

    // 5) Send file
    const filename = `${(resume.title || 'resume').replace(/[^\w\-]+/g, '_')}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(pdfBuffer);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Failed to generate PDF');
  } finally {
    if (page) {
      try { await page.close(); } catch {}
    }
  }
};

module.exports = {
  downloadResumePdf,
};
