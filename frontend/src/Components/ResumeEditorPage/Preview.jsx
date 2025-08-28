import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import axios from "axios";
import "./Preview.css";


const sanitizeHtml = (html) => {
  if (!html) return "";
  return String(html)
    // strip any <script>...</script>
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    // strip inline on* handlers (onclick, onload, etc.)
    .replace(/\son[a-z]+="[^"]*"/gi, "")
    .replace(/\son[a-z]+='[^']*'/gi, "");
};

/**
 * Props:
 * - templateId?: string
 * - rawTemplate?: string
 * - templateCss?: string
 * - resumeData: object   // can carry { theme: { accent: "#hex" } }
 * - onSectionClick?: ({section, field, path}) => void
 */
const Preview = ({
  templateId,
  rawTemplate = "",
  templateCss = "",
  resumeData,
  onSectionClick,
}) => {
  const iframeRef = useRef(null);
  const docRef = useRef(null);
  const updateFnRef = useRef(null);

  const [processedHtml, setProcessedHtml] = useState("");
  const [partsCss, setPartsCss] = useState("");

  // ---------- utilities ----------
  const tokensFromPath = (path) => String(path).split(/[\.\[\]]/).filter(Boolean);

  const getByPath = (root, path) => {
    if (!root || !path) return undefined;
    const parts = tokensFromPath(path);
    let cur = root;
    for (const p of parts) {
      const key = /^\d+$/.test(p) ? Number(p) : p;
      if (cur == null) return undefined;
      cur = cur[key];
    }
    return cur;
  };

  const formatValue = (v) => {
    if (v == null) return "";
    if (Array.isArray(v)) {
      const onlyScalars = v.every((x) => x == null || typeof x !== "object");
      return onlyScalars ? v.filter(Boolean).map(String).join(", ") : "";
    }
    if (typeof v === "object") return "";
    return String(v);
  };

  const splitHeadBody = (html) => {
    if (!html) return { headInner: "", bodyInner: "" };
    const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (headMatch || bodyMatch) {
      return {
        headInner: headMatch ? headMatch[1] : "",
        bodyInner: bodyMatch ? bodyMatch[1] : html,
      };
    }
    return { headInner: "", bodyInner: html };
  };

  // ---------- load server preview (Edit or Templates flow) ----------
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!templateId) return;

      setProcessedHtml("");
      setPartsCss("");

      // 1) try processed HTML
      try {
        const res = await axios.post(
          `http://localhost:5000/preview/api/template/preview/${templateId}`,
          resumeData || {},
          {
            headers: { "Content-Type": "application/json", Accept: "text/html" },
            responseType: "text",
          }
        );
        if (!cancelled && typeof res.data === "string") {
          setProcessedHtml(res.data);
        }
      } catch (_) {
        /* fall back to parts */
      }

      // 2) fetch CSS parts (used if processed doesn't include styles)
      try {
        const parts = await axios.get(
          `http://localhost:5000/preview/api/template/parts/${templateId}`
        );
        if (!cancelled) {
          setPartsCss(parts.data?.templateCss || "");
        }
      } catch (e) {
        // ignore; we can still use templateCss fallback
        console.error("Failed to load parts CSS:", e);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId, JSON.stringify(resumeData)]);

  // Decide body and head CSS
  const { bodyInner: processedBody, headInner: processedHead } = useMemo(
    () => splitHeadBody(processedHtml),
    [processedHtml]
  );

  const htmlBodyToWrite = useMemo(() => {
    if (processedHtml) return processedBody || "";
    return rawTemplate || "";
  }, [processedBody, processedHtml, rawTemplate]);

  // Head content:
  // - if processedHtml exists: include its <head> content + a safe fallback CSS (partsCss/templateCss)
  // - else: include templateCss (Templates flow)
  const headHtmlToWrite = useMemo(() => {
    const fallbackCss = templateId ? (partsCss || templateCss || "") : (templateCss || "");
    if (processedHtml) {
      // Keep server head styles, then add fallbackCss (harmless if duplicate)
      return `${processedHead || ""}<style>${fallbackCss}</style>`;
    }
    return `<style>${fallbackCss}</style>`;
  }, [processedHtml, processedHead, partsCss, templateCss, templateId]);

  // ---------- accent (colorful parts) helpers ----------
  const lastAccentRef = React.useRef(null);

  // exact shade + optional ramp
  const setAccentVars = (doc, hex, palette) => {
    if (!doc || !hex) return;
    doc.documentElement.style.setProperty("--accent", hex);

    const shades = (palette?.shades && palette.shades.length === 5)
      ? palette.shades
      : [hex, hex, hex, hex, hex];

    doc.documentElement.style.setProperty("--accent-100", shades[0]);
    doc.documentElement.style.setProperty("--accent-300", shades[1]);
    doc.documentElement.style.setProperty("--accent-500", shades[2]);
    doc.documentElement.style.setProperty("--accent-700", shades[3]);
    doc.documentElement.style.setProperty("--accent-900", shades[4]);
  };

  const applyAccentToDoc = React.useCallback((doc, hex, palette) => {
    if (!doc || !hex) return;
    setAccentVars(doc, hex, palette);

    let styleEl = doc.getElementById("dynamic-accent");
    if (!styleEl) {
      styleEl = doc.createElement("style");
      styleEl.id = "dynamic-accent";
      (doc.head || doc.documentElement).prepend(styleEl);
    }
    styleEl.textContent = `
      /* Text accents only when the element explicitly asks for accent */
      :where(.accent,.primary,.section-title,.title,.headline,.resume-accent) {
        color: var(--accent) !important;
      }

      /* Backgrounds for bars/panels/sidebars */
      :where(.bg-accent,.header-bar,.accent-bg,.side-block-bg,
            headerc,.headerc,.top-bar,.title-bar,.name-bar,.banner,
            .left-panel,.left-sidebar,.sidebar-header) {
        background-color: var(--accent-700, var(--accent)) !important;
      }

      /* Make text on those bars readable (white) */
      :where(.headerc,.top-bar,.title-bar,.name-bar,.banner,
            .left-panel,.left-sidebar,.sidebar-header) * {
        color: #fff !important;
      }

      /* Dividers/borders */
      :where(.border-accent,.divider,hr,.rule,.section-rule) {
        border-color: var(--accent-700, var(--accent)) !important;
      }

      /* Default links elsewhere */
      a { color: var(--accent) !important; }
    `;
  }, []);

  const repaintHeuristics = (doc, hex) => {
    if (!doc || !hex) return;
    const pick = (sel) => Array.from(doc.querySelectorAll(sel));
    const cands = [
      ...pick("header,.header,.top-bar,.title-bar,.name-bar,.banner"),
      ...pick(".left-panel,.left-sidebar,.sidebar,.sidebar-header"),
    ];
    cands.forEach((el) => {
      const cs = doc.defaultView.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      const hasBg = cs.backgroundColor && cs.backgroundColor !== "rgba(0, 0, 0, 0)";
      const isBig = rect.height > 30 || rect.width > 120;
      if (isBig && hasBg) {
        el.style.backgroundColor = hex;
        if (/^hr|div$/i.test(el.tagName)) el.style.borderColor = hex;
      }
    });
  };

  // listen for palette events; remember + apply inside iframe
  React.useEffect(() => {
    const onPick = (e) => {
      const hex = e?.detail?.hex;
      const palette = e?.detail?.palette;
      if (!hex || !iframeRef.current?.contentDocument) return;
      lastAccentRef.current = { hex, palette };
      applyAccentToDoc(iframeRef.current.contentDocument, hex, palette);
      repaintHeuristics(iframeRef.current.contentDocument, hex);
    };
    window.addEventListener("resume-apply-color", onPick);
    return () => window.removeEventListener("resume-apply-color", onPick);
  }, [applyAccentToDoc]);

  // ---------- write/refresh iframe document ----------
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !htmlBodyToWrite) return;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    const safeHead = sanitizeHtml(headHtmlToWrite);
    const safeBody = sanitizeHtml(htmlBodyToWrite);

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          ${safeHead}
          <style>
            * { box-sizing: border-box; }
            html, body { margin: 0; padding: 0; width: 100%; height: 100%; background: #fff; overflow: hidden; }
            #template-root { width: 210mm; min-height: 297mm; margin: 0 auto; transform-origin: top left; will-change: transform; }
          </style>
        </head>
        <body>
          <div id="template-root">${safeBody}</div>
        </body>
      </html>
    `);
    doc.close();
    docRef.current = doc;

    const root = () => doc.getElementById("template-root");

    // ----- scaling -----
    const recalcScale = () => {
      const el = root();
      if (!el) return;

      const cw = el.scrollWidth || el.getBoundingClientRect().width || 794;
      const ch = el.scrollHeight || el.getBoundingClientRect().height || 1123;

      const iw = iframe.clientWidth || iframe.getBoundingClientRect().width || 1;
      const ih = iframe.clientHeight || iframe.getBoundingClientRect().height || 1;

      const scale = Math.min(iw / cw, ih / ch, 1);
      el.style.transform = `scale(${scale})`;
      const scaledH = Math.ceil(ch * scale);
      doc.body.style.height = `${scaledH}px`;
      doc.documentElement.style.height = `${scaledH}px`;
    };

    // scale after resources load & on resize/DOM changes
    const imgs = Array.from(doc.images || []);
    let loaded = 0;
    const done = () => { loaded += 1; if (loaded >= imgs.length) recalcScale(); };
    if (imgs.length) {
      imgs.forEach((img) => {
        if (img.complete) done();
        else {
          img.addEventListener("load", done);
          img.addEventListener("error", done);
        }
      });
    } else {
      setTimeout(recalcScale, 40);
    }

    const mo = new MutationObserver(() => recalcScale());
    mo.observe(doc.body, { childList: true, subtree: true, characterData: true });
    const onResize = () => recalcScale();
    window.addEventListener("resize", onResize);

    // ----- click-to-focus -----
    const handleClick = (e) => {
      const target = e.target.closest?.("[data-edit-id]");
      if (!target) return;
      const path = target.getAttribute("data-edit-id") || "";
      if (!path) return;

      const tokens = tokensFromPath(path);
      let section = tokens[0] || "";
      const field = tokens[tokens.length - 1] || "";
      if (section === "personalInfo") section = "personal";
      if (section === "additionalInfos") section = "additional";

      onSectionClick?.({ section, field, path });
    };
    doc.addEventListener("click", handleClick);

    // ----- population function for data-edit-id (client fill path) -----
    updateFnRef.current = () => {
      if (!resumeData) return;
      const nodes = doc.querySelectorAll("[data-edit-id]");
      if (!nodes.length) return;

      nodes.forEach((el) => {
        const path = el.getAttribute("data-edit-id");
        if (!path) return;
        const val = getByPath(resumeData, path);

        if (el.tagName === "IMG") {
          // only set if you have a value; don't remove existing src
          if (val) el.setAttribute("src", String(val));
          return;
        }

        // only overwrite text when you have something meaningful
        const txt = formatValue(val);
        if (txt != null && String(txt).trim() !== "") {
          el.textContent = String(txt);
        }
      });
      recalcScale();
    };


    // initial populate
    updateFnRef.current?.();

    // >>> apply saved accent (if any) after DOM is in place <<<
    const savedHex = lastAccentRef.current?.hex || resumeData?.theme?.accent;
    const savedPalette = lastAccentRef.current?.palette;
    if (savedHex) {
      applyAccentToDoc(doc, savedHex, savedPalette);
      repaintHeuristics(doc, savedHex);
    }


    // cleanup
    return () => {
      doc.removeEventListener("click", handleClick);
      mo.disconnect();
      window.removeEventListener("resize", onResize);
      imgs.forEach((img) => {
        img.removeEventListener("load", done);
        img.removeEventListener("error", done);
      });
    };
  }, [htmlBodyToWrite, headHtmlToWrite, onSectionClick, resumeData, applyAccentToDoc]);

  // re-populate on resume data change without rewriting DOM
  useEffect(() => {
    updateFnRef.current?.();
  }, [resumeData]);

  // re-apply accent whenever it changes externally (e.g., saved value)
  useEffect(() => {
    if (docRef.current && resumeData?.theme?.accent) {
      applyAccentToDoc(docRef.current, resumeData.theme.accent);
    }
  }, [resumeData?.theme?.accent, applyAccentToDoc]);

  return (
    <div className="preview">
      <div className="preview-box" style={{ width: "100%", height: 600, overflow: "hidden", borderRadius: 8 }}>
        <iframe
          title="Resume Preview"
          ref={iframeRef}
          style={{ width: "100%", height: "100%", border: "none", background: "#fff" }}
        />
      </div>
    </div>
  );
};

export default Preview;
