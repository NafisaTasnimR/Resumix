import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';

// ---- keep your existing helper for fallback ----
function fillTemplateWithEachAndJoin(raw, data) {
  const normalizePath = (p) => (p || '').replace(/\[(\d+)\]/g, '.$1').trim();
  const getProp = (obj, p) => normalizePath(p).split('.').reduce((o,k)=> (o ? o[k] : undefined), obj);

  function applyJoin(value, helperArgs) {
    const [sepRaw, keyRaw] = helperArgs.split(',').map(s => s?.trim()).filter(Boolean);
    const sep = sepRaw?.replace(/^"(.*)"$/, '$1') ?? ', ';
    const propKey = keyRaw?.replace(/^"(.*)"$/, '$1');
    if (!Array.isArray(value) || value.length === 0) return '';
    if (propKey) return value.map(v => (v && v[propKey] != null ? String(v[propKey]) : '')).filter(Boolean).join(sep);
    return value.map(v => (v == null ? '' : String(v))).filter(Boolean).join(sep);
  }

  function fillOnce(str, root, ctx, idx) {
    return str.replace(/{{\s*([^}]+)\s*}}/g, (_, expr) => {
      if (expr === '@index' && typeof idx === 'number') return String(idx);
      if ((expr === '.' || expr === 'this') && ctx !== undefined) return ctx == null ? '' : String(ctx);

      const pipeIdx = expr.indexOf('|');
      if (pipeIdx !== -1) {
        const left = normalizePath(expr.slice(0, pipeIdx).trim());
        const right = expr.slice(pipeIdx + 1).trim();
        if (right.toLowerCase().startsWith('join')) {
          const argMatch = right.match(/^join\s*:(.*)$/i);
          const args = argMatch ? argMatch[1].trim() : '';
          const candidate = (ctx !== undefined ? getProp(ctx, left) : undefined) ?? getProp(root, left);
          return applyJoin(candidate, args || '');
        }
      }

      const p = normalizePath(expr);
      let val = (ctx !== undefined ? getProp(ctx, p) : undefined);
      if (val === undefined) val = getProp(root, p);

      if (Array.isArray(val)) {
        if (val.every(v => typeof v !== 'object')) return val.map(v => String(v)).join(' | ');
        return '';
      }
      return val == null ? '' : String(val);
    });
  }

  function expandEach(html, root, ctx) {
    const EACH = /{{#each\s+([^}]+)}}([\s\S]*?){{\/each}}/g;
    return html.replace(EACH, (_, rawPath, inner) => {
      const path = normalizePath(rawPath);
      const arr = (ctx !== undefined ? getProp(ctx, path) : undefined) ?? getProp(root, path);
      if (!Array.isArray(arr) || arr.length === 0) return '';
      return arr.map((item, i) => fillOnce(expandEach(inner, root, item), root, item, i)).join('');
    });
  }

  const withEach = expandEach(raw, data);
  return fillOnce(withEach, data);
}

const ResumeRenderer = ({ resume }) => {
  const [processedHtml, setProcessedHtml] = useState(''); // from new backend endpoint
  const [tplCss, setTplCss] = useState('');               // fallback only
  const [tplBodyRaw, setTplBodyRaw] = useState('');       // fallback only

  useEffect(() => {
    const run = async () => {
      setProcessedHtml('');
      setTplCss('');
      setTplBodyRaw('');
      if (!resume?.templateId) return;

      // 1) Try the NEW processed-preview endpoint (preferred)
      try {
        const res = await axios.post(
          `http://localhost:5000/preview/api/template/preview/${resume.templateId}`,
          resume?.ResumeData || {},
          { headers: { 'Content-Type': 'application/json', 'Accept': 'text/html' }, responseType: 'text' }
        );
        if (typeof res.data === 'string' && res.data.length > 0) {
          setProcessedHtml(res.data);
          return; // success; no need for fallback
        }
      } catch (e) {
        console.warn('Processed preview not available, falling back to parts:', e?.message);
      }

      // 2) Fallback to your existing parts endpoint and client-side fill
      try {
        const parts = await axios.get(
          `http://localhost:5000/preview/api/template/parts/${resume.templateId}`
        );
        setTplCss(parts.data.templateCss || '');
        setTplBodyRaw(parts.data.rawTemplate || '');
      } catch (e) {
        console.error('Failed to load template parts:', e);
      }
    };
    run();
  }, [resume?.templateId, resume?.ResumeData]);

  // Client-side fill (only used for fallback)
  const finalHtmlFallback = useMemo(() => {
    if (!tplBodyRaw || !resume?.ResumeData) return '';
    return fillTemplateWithEachAndJoin(tplBodyRaw, resume?.ResumeData);
  }, [tplBodyRaw, resume?.ResumeData]);

  // Render: prefer processedHtml (already A4-ready & CSS-scoped). Otherwise fallback.
  if (processedHtml) {
    return (
      <div className={`resume-preview processed`}>
        <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
      </div>
    );
  }

  // Fallback rendering (your old behavior)
  return (
    <div className={`resume-template ${resume?.templateId}`}>
      <style dangerouslySetInnerHTML={{ __html: tplCss }} />
      {finalHtmlFallback && <div dangerouslySetInnerHTML={{ __html: finalHtmlFallback }} />}
    </div>
  );
};

export default ResumeRenderer;
