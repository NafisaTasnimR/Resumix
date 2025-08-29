const crypto = require('crypto');
const Resume = require('../models/Resume');
const { prepareTemplateHtml } = require('../services/TemplateRenderService');

// Utility: build a frontend-facing URL for outsiders to open
function buildPublicUrl(req, token) {
  // Prefer explicit env var; fallback to same host as API
  const base =
    process.env.PUBLIC_VIEW_BASE || // e.g., http://localhost:5173/public/resume
    `${req.protocol}://${req.get('host')}/public/resume`;
  return `${base}/${token}`;
}

// POST /resume/:id/share  (auth) -> create or rotate a token
exports.createShareLink = async (req, res) => {
  try {
    const { id } = req.params;
    const rotate = req.query.rotate === '1' || req.body.rotate === true;

    const resume = await Resume.findById(id);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    // Only owner can share
    if (resume.userEmail !== req.user.email) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (!resume.shareToken || rotate) {
      // URL-safe token
      resume.shareToken = crypto.randomBytes(16).toString('base64url');
      await resume.save();
    }

    const url = buildPublicUrl(req, resume.shareToken);
    return res.json({ url, token: resume.shareToken });
  } catch (err) {
    console.error('createShareLink error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /resume/:id/share (auth) -> fetch existing token/link (if any)
exports.getShareLink = async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findById(id);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    if (resume.userEmail !== req.user.email) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (!resume.shareEnabled) {
      return res.json({ url: null, token: null, disabled: true });
    }

    if (!resume.shareToken) {
      return res.json({ url: null, token: null });
    }

    const url = buildPublicUrl(req, resume.shareToken);
    return res.json({ url, token: resume.shareToken });
  } catch (err) {
    console.error('getShareLink error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /public/resume/:token  (no auth) -> return fully rendered HTML
exports.publicViewHtml = async (req, res) => {
  try {
    const { token } = req.params;
    const resume = await Resume.findOne({ shareToken: token }).lean();
    if (!resume || resume.shareEnabled === false) {
      return res.status(404).send('Not found');
    }

    const templateId = resume.templateId || 'Resume1';
    const resumeData = resume.ResumeData || {};
    // title fallback
    const title = resume.title || 'Resume';

    // Prepare a printable, read-only HTML using your existing service
    const { finalHtml } = await prepareTemplateHtml(templateId, resumeData, 'public');

    // Send a minimal HTML page
    return res.send(`
        <!doctype html>
        <html>
        <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <title>${title}</title>
        <style>
            /* Lock it read-only and centered */
            body{margin:0;background:#f5f5f5;font-family:system-ui,Segoe UI,Roboto,Arial}
            .wrap{max-width:755px;margin:24px auto;padding:16px}
            .note{font-size:12px;opacity:.7;margin-bottom:8px}
            .sheet{box-shadow:0 2px 20px rgba(0,0,0,.1);background:#fff}
        </style>
        </head>
        <body>
        <div class="wrap">
            <div class="note">Public read-only view</div>
            <div class="sheet">${finalHtml}</div>
        </div>
        </body>
        </html>`);
  } catch (err) {
    console.error('publicViewHtml error', err);
    return res.status(500).send('Internal server error');
  }
};

// (Optional) JSON endpoint if you prefer SPA to render it
exports.publicViewJson = async (req, res) => {
  try {
    const { token } = req.params;
    const resume = await Resume.findOne({ shareToken: token }).lean();
    if (!resume || resume.shareEnabled === false) {
      return res.status(404).json({ message: 'Not found' });
    }
    return res.json({
      title: resume.title,
      templateId: resume.templateId,
      ResumeData: resume.ResumeData
    });
  } catch (err) {
    console.error('publicViewJson error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
