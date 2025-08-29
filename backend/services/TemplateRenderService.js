// services/templateRender.service.js
const fs = require('fs/promises');
const path = require('path');
const postcss = require('postcss');
const prefixer = require('postcss-prefix-selector');
const cheerio = require('cheerio');
// If you want to allow a bit of rich text for specific fields, uncomment and install:
// const sanitizeHtml = require('sanitize-html');

function _getByPath(obj, path) {
  if (!obj || !path) return undefined;
  const norm = String(path)
    .replace(/\[(\d+)\]/g, '.$1')  // a[0].b -> a.0.b
    .replace(/^\./, '')
    .trim();
  return norm.split('.').reduce((o, k) => (o != null ? o[k] : undefined), obj);
}

// Safely stringify any value for text nodes
function _toText(val, joinProp) {
  if (val == null) return '';
  if (Array.isArray(val)) {
    if (joinProp) {
      return val
        .map(v => (v && typeof v === 'object' ? v[joinProp] : v))
        .filter(Boolean)
        .join(', ');
    }
    return val.map(v => (v == null ? '' : String(v))).filter(Boolean).join(', ');
  }
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
}

function applyDataEditBindings(html, data) {
  const $ = cheerio.load(html, { decodeEntities: false });

  // conditionals first
  $('[data-if-path]').each((_, el) => {
    const path = $(el).attr('data-if-path');
    const v = _getByPath(data, path);
    const truthy = Array.isArray(v) ? v.length > 0 : !!v;
    if (!truthy) $(el).remove();
  });

  // text fields
  $('[data-edit-id]').each((_, el) => {
    const $el = $(el);
    const path = $el.attr('data-edit-id');
    const joinProp = $el.attr('data-join');
    let v = _getByPath(data, path);
    if (v == null || (Array.isArray(v) && v.length === 0)) {
      $el.text(''); // clear so pruneEmpty can remove shells
      return;
    }
    $el.text(_toText(v, joinProp));
  });

  // links
  $('[data-edit-href]').each((_, el) => {
    const $el = $(el);
    const v = _getByPath(data, $el.attr('data-edit-href'));
    const url = v && String(v).trim();
    if (url && /^(https?:|mailto:|tel:)/i.test(url)) $el.attr('href', url);
    else $el.removeAttr('href');
  });

  // images
  $('[data-edit-src]').each((_, el) => {
    const $el = $(el);
    const v = _getByPath(data, $el.attr('data-edit-src'));
    const url = v && String(v).trim();
    if (url && /^https?:\/\//i.test(url)) $el.attr('src', url);
    else $el.remove(); // avoid broken boxes
  });

  return $.root().html();
}

const TEMPLATES_DIR = path.resolve(process.cwd(), 'templates');

/* --------------------- utils --------------------- */
const normalizePath = (p) => (p || '').replace(/\[(\d+)\]/g, '.$1').trim();
const getProp = (obj, p) => {
  if (!p) return undefined;
  const parts = normalizePath(p).split('.');
  let cur = obj;
  for (const k of parts) {
    if (k === '') continue;
    if (cur == null) return undefined;
    cur = cur[k];
  }
  return cur;
};

/* ---------------- extract template parts ---------------- */
async function readTemplatePartsById(id) {
  const htmlPath = path.join(TEMPLATES_DIR, `${id}.html`);
  const html = await fs.readFile(htmlPath, 'utf8');
  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  const bodyMatch  = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const templateCss = styleMatch ? styleMatch[1] : '';
  const rawTemplate = bodyMatch ? bodyMatch[1] : html;
  return { templateCss, rawTemplate };
}

/* ---------------- scope CSS so it can't leak ---------------- */
async function scopeCss(css, scopeClass) {
  if (!css.trim()) return css;

  const result = await postcss().use(prefixer({
    prefix: `.${scopeClass}`,
    transform: (prefix, selector, prefixedSelector) => {
      if (selector.startsWith('@')) return selector;                 // @keyframes, etc.
      if (/^(html|body)\b/.test(selector.trim())) {                  // avoid global takeover
        return selector.replace(/^(html|body)/, `${prefix} $&`);
      }
      return prefixedSelector;
    }
  })).process(css, { from: undefined });

  // drop large fixed heights (source of PDF clipping)
  // drop large fixed heights and widths (source of PDF clipping / internal scrollbars)
  const cleaned = result.css
    // Replace large heights with min-height:auto to avoid clipping inside the A4 wrapper
    .replace(/height\s*:\s*(\d+)px\s*;?/gi, (m, num) => {
      return parseInt(num, 10) <= 20 ? m : 'min-height: auto;';
    })
    // Replace large fixed widths with responsive rules so content fits the A4 container
    .replace(/width\s*:\s*(\d+)px\s*;?/gi, (m, num) => {
      const n = parseInt(num, 10);
      // if width is larger than typical A4 width in px (~794px at 96dpi) treat as fixed and make responsive
      if (n > 794) return 'width: 100%; max-width: 100%;';
      return m;
    });

  return cleaned;
}

/* ---------------- placeholders: join + scalars ---------------- */
function applyJoinHelper(value, helperArgs) {
  // {{ path | join:", " }} or {{ path | join:" • ","name" }}
  const [sepRaw, keyRaw] = helperArgs.split(',').map(s => s?.trim()).filter(Boolean);
  const sep = sepRaw?.replace(/^"(.*)"$/, '$1') ?? ', ';
  const propKey = keyRaw?.replace(/^"(.*)"$/, '$1');

  if (!Array.isArray(value) || value.length === 0) return '';
  if (propKey) return value.map(v => (v && v[propKey] != null ? String(v[propKey]) : '')).filter(Boolean).join(sep);
  // primitive join
  return value.map(v => (v == null ? '' : String(v))).filter(Boolean).join(sep);
}

function fillPlaceholdersOnce(str, rootData, ctx = undefined, idx = undefined) {
  return str.replace(/{{\s*([^}]+)\s*}}/g, (_, expr) => {
    if (expr === '@index' && typeof idx === 'number') return String(idx);

    // support {{.}} / {{this}} for primitive item in each
    if ((expr === '.' || expr === 'this') && ctx !== undefined) return ctx == null ? '' : String(ctx);

    // support helper: foo.bar | join:", " (optional prop)
    const pipeIdx = expr.indexOf('|');
    if (pipeIdx !== -1) {
      const left = normalizePath(expr.slice(0, pipeIdx).trim());
      const right = expr.slice(pipeIdx + 1).trim();
      if (right.toLowerCase().startsWith('join')) {
        const argMatch = right.match(/^join\s*:(.*)$/i);
        const args = argMatch ? argMatch[1].trim() : '';
        const candidate = (ctx !== undefined ? getProp(ctx, left) : undefined) ?? getProp(rootData, left);
        return applyJoinHelper(candidate, args || '');
      }
    }

    // plain path
    const path = normalizePath(expr);
    let val = (ctx !== undefined ? getProp(ctx, path) : undefined);
    if (val === undefined) val = getProp(rootData, path);

    if (Array.isArray(val)) {
      // auto-join primitives so it prints in the same spot
      if (val.every(v => typeof v !== 'object')) {
        return val.map(v => (v == null ? '' : String(v))).filter(Boolean).join(' | ');
      }
      // array of objects w/o helper -> empty (use #each or join:"prop")
      return '';
    }
    if (val instanceof Date) return new Date(val).toLocaleDateString();
    return val == null ? '' : String(val);
  });
}

/* ---------------- #each repeater (supports nesting) ---------------- */
function expandEachBlocks(html, rootData, ctx = undefined) {
  const EACH = /{{#each\s+([^}]+)}}([\s\S]*?){{\/each}}/g;

  // Expand innermost first by recursion
  return html.replace(EACH, (_, rawPath, inner) => {
    const path = normalizePath(rawPath);
    const arr = (ctx !== undefined ? getProp(ctx, path) : undefined) ?? getProp(rootData, path);
    if (!Array.isArray(arr) || arr.length === 0) return '';

    let out = '';
    arr.forEach((item, i) => {
      // allow nested #each inside; expand inner with item as ctx
      const expandedInner = expandEachBlocks(inner, rootData, item);
      // then fill placeholders with item-first resolution and @index
      const filled = fillPlaceholdersOnce(expandedInner, rootData, item, i);
      out += filled;
    });
    return out;
  });
}

/* ---------------- prune empty sections & wrap to A4 ---------------- */
function pruneEmpty(filledBodyHtml) {
  const $ = cheerio.load(filledBodyHtml, { decodeEntities: false });

  // 1) explicit optional blocks
  $('[data-if]').each((_, el) => {
    const v = ($(el).attr('data-if') || '').trim();
    if (!v || v === '0' || v === 'false') $(el).remove();
  });

  // 2) quick empty shells
  const suspects = [
    '.optional-block', '.section', '.item', '.row', '.field',
    'li', 'p', 'h1','h2','h3','h4','h5','h6'
  ];
  $(suspects.join(',')).each((_, el) => {
    const $el = $(el);
    const text = ($el.text() || '').replace(/\s+/g, '');
    const hasMedia = $el.find('img, svg, picture, video, audio, canvas, iframe').length > 0;
    if (!hasMedia && text.length === 0) $el.remove();
  });

  // 3) connector-only cleanup
  const CONNECTOR_WORDS = /\b(in|at|to|with|from|for|of|on|by|and|or)\b/gi;
  const SEP = /[,|:;·•\-–—]/g;

  const stripConnectors = (s) => {
    if (!s) return '';
    return String(s)
      .replace(SEP, ' ')
      .replace(CONNECTOR_WORDS, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };
  const isConnectorOnly = (s) => stripConnectors(s) === '';

  // remove inline nodes that are only separators/glue
  $('p, li, span, div, small, em, strong').each((_, el) => {
    const $el = $(el);
    if ($el.find('img,svg,ul,ol,table,video,audio,canvas,iframe').length) return;
    const txt = ($el.text() || '').trim();
    if (txt && isConnectorOnly(txt)) $el.remove();
  });

  // 4) remove header-only sections (after connector strip)
  $('.section, section').each((_, el) => {
    const $el = $(el);
    const $clone = $el.clone();

    $clone.find('h1,h2,h3,h4,h5,h6,header').remove();
    $clone.find('ul:empty, ol:empty, dl:empty').remove();

    $clone.find('li, p, div, section, article, dd, dt').each((__, c) => {
      const $c = $(c);
      const text = ($c.text() || '').trim();
      const hasMedia = $c.find('img,svg,picture,canvas,iframe,video,audio').length > 0;
      if (!hasMedia && (!text || isConnectorOnly(text))) $c.remove();
    });

    const remainText = stripConnectors($clone.text() || '');
    const hasBlocks = $clone.find('li,.item,.row,.entry,.achievement,.edu,.exp,.project,.skill,.certification').length > 0;

    if (!remainText && !hasBlocks) $el.remove();
  });

  // 5) fix dangling punctuation & empty ()/[]
  $('*').each((_, el) => {
    const $el = $(el);
    let html = $el.html();
    if (!html) return;

    html = html.replace(/\(([^)]*)\)/g, (m, inner) => (isConnectorOnly(inner) ? '' : m));
    html = html.replace(/\[([^\]]*)\]/g, (m, inner) => (isConnectorOnly(inner) ? '' : m));

    html = html
      .replace(/(\s*[,|:;·•\-–—]\s*){2,}/g, '$1')
      .replace(/^[\s,|:;·•\-–—]+|[\s,|:;·•\-–—]+$/g, '');

    $el.html(html);
  });

  // 6) final sweep after edits
  $('li, p, div').each((_, el) => {
    const $el = $(el);
    const text = ($el.text() || '').replace(/\s+/g, '');
    const hasMedia = $el.find('img, svg, picture, video, audio, canvas, iframe').length > 0;
    if (!hasMedia && text.length === 0) $el.remove();
  });

  return $('body').length ? $('body').html() : $.html();
}


// services/templateRender.service.js
function buildA4Html(prunedBody, scopedCss, scopeClass) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
  /* Use printer's color; keep backgrounds */
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  /* Real page size/margins for PDF */
  @page { size: A4; margin: 8mm; }

  /* === PAGE CONTAINER ===
     In PRINT: fill the printable area (avoid 210mm hard width to prevent auto-shrink).
     In SCREEN: show a neat grey "paper" frame so users see the page edges. */
  .page, .${scopeClass}, .${scopeClass} * { box-sizing: border-box; }

  /* PRINT (used by Puppeteer) */
  @media print {
    body { margin: 0; }
    .page { width: 100%; min-height: 100%; margin: 0; background: #fff; }
  }

  /* SCREEN (web preview) */
  @media screen {
    body { background: #f2f3f5; }
    .page {
      width: calc(210mm - 16mm);             /* 210 - (left+right page margins) */
      min-height: calc(297mm - 16mm);         /* 297 - (top+bottom page margins) */
      margin: 10px 10px 10px 10px;
      background: #fff;
      outline: 1px solid #d9d9d9;             /* subtle page edge */
      box-shadow: 0 4px 12px rgba(0,0,0,.07);
    }
  }

  /* The scoped template content should fill the page area */
  .${scopeClass} { width: 100%; min-height: 100%; margin: 0; }

  /* Avoid bad page breaks */
  .${scopeClass} section, .${scopeClass} header, .${scopeClass} .section,
  .${scopeClass} .item, .${scopeClass} .row { page-break-inside: avoid; break-inside: avoid; }

  .${scopeClass} img, .${scopeClass} table { max-width: 100%; height: auto; }

  /* === Template CSS (scoped) === */
  ${scopedCss}
</style>
</head>
<body>
  <div class="page">
    <div class="${scopeClass}">
      ${prunedBody}
    </div>
  </div>
</body>
</html>`;
}

function makeAccentCss(scopeClass, accentHex) {
  if (!accentHex) return '';
  const prefix = `.${scopeClass}`;
  return `
${prefix} { --accent: ${accentHex}; --accent-700: ${accentHex}; }

${prefix} :where(.accent,.primary,.section-title,.title,.headline,.resume-accent){
  color: var(--accent) !important;
}

${prefix} :where(.bg-accent,.header-bar,.accent-bg,.side-block-bg,
                 headerc,.headerc,.top-bart,.title-bar,.name-bar,.banner,
                 .left-panel,.sidebart,.sidebar-header){
  background-color: var(--accent-700, var(--accent)) !important;
}

${prefix} :where(.headerc,.top-bart,.title-bar,.name-bar,.banner,
                 .left-panel,.sidebart,.sidebar-header) *{
  color:#fff !important;
}

${prefix} :where(.border-accent,.divider,hr,.rule,.section-rule){
  border-color: var(--accent-700, var(--accent)) !important;
}
`;
}



/* ---------------- main: read -> expand -> fill -> prune -> wrap ---------------- */
exports.prepareTemplateHtml = async (templateId, resumeData, scopeSuffix = '') => {
  const scopeClass = `resume-scope${scopeSuffix ? '-' + scopeSuffix : ''}`;
  const { templateCss, rawTemplate } = await readTemplatePartsById(templateId);

  // 1) Expand {{#each}} blocks (supports nesting)
  const withEach = expandEachBlocks(rawTemplate, resumeData);

  // 2) Fill simple {{...}} placeholders (& helpers)
  const filled = fillPlaceholdersOnce(withEach, resumeData);

  // 2.5) Bind data-edit-* over any static fallback text (e.g., "JOHN SMITH")
  const bound = applyDataEditBindings(filled, resumeData);

  // 3) Prune empties & connector-only leftovers (keeps structure clean)
  const pruned = pruneEmpty(bound);

  // 4) Scope CSS to avoid clashes
  const scopedCss = await scopeCss(templateCss || '', scopeClass);

  //4.5) Add saved accent color from ResumeData.theme.accent (if present)
  const accentHex = resumeData?.theme?.accent || '';
  const combinedCss = `${scopedCss}\n${makeAccentCss(scopeClass, accentHex)}`;

  // 5) Wrap into A4 print shell
  //const finalHtml = buildA4Html(pruned, scopedCss, scopeClass);
  const finalHtml = buildA4Html(pruned, combinedCss, scopeClass);
  return { finalHtml, scopeClass };
};
