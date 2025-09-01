import React, { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";

/* ------------------------- tiny helpers ------------------------- */

// Strip scripts/inline handlers so we don’t execute anything while injecting HTML
const sanitizeHtml = (html) => {
  if (!html) return "";
  return String(html)
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son[a-z]+="[^"]*"/gi, "")
    .replace(/\son[a-z]+='[^']*'/gi, "");
};

// Apply accent to the rendered resume (processed or fallback)
const applyAccentToDocument = (rootEl, hex) => {
  if (!rootEl || !hex) return;
  const doc = rootEl.ownerDocument;

  // expose variables at both element and document level
  rootEl.style.setProperty("--accent", hex);
  rootEl.style.setProperty("--accent-700", hex);
  doc.documentElement.style.setProperty("--accent", hex);
  doc.documentElement.style.setProperty("--accent-700", hex);

  let styleEl = doc.getElementById("dynamic-accent-view");
  if (!styleEl) {
    styleEl = doc.createElement("style");
    styleEl.id = "dynamic-accent-view";
    (doc.head || doc.documentElement).prepend(styleEl);
  }

  styleEl.textContent = `
    /* text accents only where explicitly marked */
    :where(.accent,.primary,.section-title,.title,.headline,.resume-accent){
      color: var(--accent) !important;
    }

    /* bars/panels/sidebars */
    :where(.bg-accent,.header-bar,.accent-bg,.side-block-bg,
           headerc,.headerc,.top-bart,.title-bar,.name-bar,.banner,
           .left-panel,.sidebart,.sidebar-headert){
      background-color: var(--accent-700, var(--accent)) !important;
    }

    /* readable text on dark bars */
    :where(.headerc,.top-bart,.title-bar,.name-bar,.banner,
           .left-panel,.sidebart,.sidebar-headert) *{
      color:#fff !important;
    }

    /* borders/dividers */
    :where(.border-accent,.divider,hr,.rule,.section-rule){
      border-color: var(--accent-700, var(--accent)) !important;
    }

  `;
};

/* --------------------------- component -------------------------- */

const ResumeRenderer = ({ resume }) => {
  const containerRef = useRef(null);

  const [processedHtml, setProcessedHtml] = useState("");
  const [templateCss, setTemplateCss] = useState("");
  const [rawTemplate, setRawTemplate] = useState("");

  const templateId = resume?.templateId || "";
  const resumeData = resume?.ResumeData || {};

  // Load processed preview HTML and (fallback) parts for the template
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!templateId) {
        setProcessedHtml("");
        setTemplateCss("");
        setRawTemplate("");
        return;
      }

      // 1) processed HTML (server-rendered with data)
      try {
        const res = await axios.post(
          `http://localhost:5000/preview/api/template/preview/${templateId}`,
          resumeData,
          {
            headers: { "Content-Type": "application/json", Accept: "text/html" },
            responseType: "text",
          }
        );
        if (!cancelled && typeof res.data === "string") {
          setProcessedHtml(res.data);
        }
      } catch {
        // ignore; we’ll fall back to parts
      }

      // 2) parts (raw template + CSS) for fallback
      try {
        const parts = await axios.get(
          `http://localhost:5000/preview/api/template/parts/${templateId}`
        );
        if (!cancelled) {
          setTemplateCss(parts.data?.templateCss || "");
          setRawTemplate(parts.data?.rawTemplate || "");
        }
      } catch {
        // ignore
      }
    };

    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId, JSON.stringify(resumeData)]);

  const safeProcessed = useMemo(
    () => sanitizeHtml(processedHtml),
    [processedHtml]
  );
  const safeRaw = useMemo(() => sanitizeHtml(rawTemplate), [rawTemplate]);

  // Re-apply saved accent when content changes or when accent is present
  useEffect(() => {
    const hex =
      resume?.ResumeData?.theme?.accent ||
      resume?.theme?.accent ||
      "";

    if (hex && containerRef.current) {
      applyAccentToDocument(containerRef.current, hex);
    }
  }, [safeProcessed, safeRaw, templateCss, resume?.ResumeData?.theme?.accent]);

  /* ----------------------------- render ----------------------------- */
  // Prefer processed HTML (A4-ready). Otherwise show fallback (raw + CSS).
  if (safeProcessed) {
    return (
      <div ref={containerRef} className="resume-preview processed">
        <div dangerouslySetInnerHTML={{ __html: safeProcessed }} />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`resume-template ${templateId}`}>
      {templateCss ? (
        <style dangerouslySetInnerHTML={{ __html: templateCss }} />
      ) : null}
      {safeRaw ? <div dangerouslySetInnerHTML={{ __html: safeRaw }} /> : null}
    </div>
  );
};

export default ResumeRenderer;
