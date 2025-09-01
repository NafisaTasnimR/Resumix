import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import axios from "axios";
import "./Preview.css";

const sanitizeHtml = (html) => {
  if (!html) return "";
  return String(html)
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son[a-z]+="[^"]*"/gi, "")
    .replace(/\son[a-z]+='[^']*'/gi, "");
};

/**
 * Props:
 * - templateId?: string
 * - rawTemplate?: string
 * - templateCss?: string
 * - resumeData: object   // can carry { theme: { accent, fontFamily, fontCssUrl } }
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

  // Head content
  const headHtmlToWrite = useMemo(() => {
    const fallbackCss = templateId ? (partsCss || templateCss || "") : (templateCss || "");
    if (processedHtml) {
      return `${processedHead || ""}<style>${fallbackCss}</style>`;
    }
    return `<style>${fallbackCss}</style>`;
  }, [processedHtml, processedHead, partsCss, templateCss, templateId]);

  // ---------- ACCENT helpers ----------
  const lastAccentRef = useRef(null);

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

  const applyAccentToDoc = useCallback((doc, hex, palette) => {
    if (!doc || !hex) return;
    setAccentVars(doc, hex, palette);

    let styleEl = doc.getElementById("dynamic-accent");
    if (!styleEl) {
      styleEl = doc.createElement("style");
      styleEl.id = "dynamic-accent";
      (doc.head || doc.documentElement).prepend(styleEl);
    }
    styleEl.textContent = `
      :where(.accent,.primary,.section-title,.title,.headline,.resume-accent) {
        color: var(--accent) !important;
      }
      :where(.bg-accent,.header-bar,.accent-bg,.side-block-bg,
            headerc,.headerc,.top-bart,.title-bar,.name-bar,.banner,
            .left-panel,.sidebart,.sidebar-headert) {
        background-color: var(--accent-700, var(--accent)) !important;
      }
      :where(.headerc,.top-bart,.title-bar,.name-bar,.banner,
            .left-panel,.sidebart,.sidebar-headert) * {
        color: #fff !important;
      }
      :where(.border-accent,.divider,hr,.rule,.section-rule) {
        border-color: var(--accent-700, var(--accent)) !important;
      }
    `;
  }, []);

  const repaintHeuristics = (doc, hex) => {
    if (!doc || !hex) return;
    const pick = (sel) => Array.from(doc.querySelectorAll(sel));
    const cands = [
      ...pick("headerc,.headerc,.top-bart,.title-bar,.name-bar,.banner"),
      ...pick(".left-panel,.sidebart,.sidebar-headert"),
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

  // ---------- FONT helpers ----------
  const lastFontRef = useRef({ family: null, cssUrl: null });

  const applyFontToDoc = (doc, family, cssUrl) => {
    if (!doc) return;

    // load Google CSS if provided
    if (cssUrl) {
      const id = "gf-" + btoa(cssUrl).replace(/=/g, "");
      if (!doc.getElementById(id)) {
        const link = doc.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.href = cssUrl;
        (doc.head || doc.documentElement).appendChild(link);
      }
    }

    let styleEl = doc.getElementById("dynamic-font");
    if (!styleEl) {
      styleEl = doc.createElement("style");
      styleEl.id = "dynamic-font";
      (doc.head || doc.documentElement).prepend(styleEl);
    }

    styleEl.textContent = `
      :root { --resume-font: ${family || "inherit"}; }
      body, #template-root, #template-root *, .resume-container, .resume-container * {
        font-family: var(--resume-font) !important;
      }
    `;
  };

  const resetFontInDoc = (doc) => {
    if (!doc) return;
    const styleEl = doc.getElementById("dynamic-font");
    if (styleEl) styleEl.remove();
  };

  // listen for palette color events
  useEffect(() => {
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

  // listen for font pick/reset events
  useEffect(() => {
    const onFont = (e) => {
      const { family, cssUrl } = e?.detail || {};
      if (!iframeRef.current?.contentDocument) return;
      lastFontRef.current = { family, cssUrl };
      applyFontToDoc(iframeRef.current.contentDocument, family, cssUrl);
    };
    const onReset = () => {
      if (!iframeRef.current?.contentDocument) return;
      lastFontRef.current = { family: null, cssUrl: null };
      resetFontInDoc(iframeRef.current.contentDocument);
    };
    window.addEventListener("resume-apply-font", onFont);
    window.addEventListener("resume-reset-font", onReset);
    return () => {
      window.removeEventListener("resume-apply-font", onFont);
      window.removeEventListener("resume-reset-font", onReset);
    };
  }, []);

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

    // ----- data edit populate -----
    updateFnRef.current = () => {
      if (!resumeData) return;
      const nodes = doc.querySelectorAll("[data-edit-id]");
      if (!nodes.length) return;

      nodes.forEach((el) => {
        const path = el.getAttribute("data-edit-id");
        if (!path) return;
        const val = getByPath(resumeData, path);

        if (el.tagName === "IMG") {
          if (val) el.setAttribute("src", String(val));
          return;
        }

        const txt = formatValue(val);
        if (txt != null && String(txt).trim() !== "") {
          el.textContent = String(txt);
        }
      });
      recalcScale();
    };

    // initial populate
    updateFnRef.current?.();

    // >>> apply saved accent & font (if any) after DOM is in place <<<
    const savedHex = lastAccentRef.current?.hex || resumeData?.theme?.accent;
    const savedPalette = lastAccentRef.current?.palette;
    if (savedHex) {
      applyAccentToDoc(doc, savedHex, savedPalette);
      repaintHeuristics(doc, savedHex);
    }
    const savedFamily = (lastFontRef.current?.family) || resumeData?.theme?.fontFamily;
    const savedCssUrl = (lastFontRef.current?.cssUrl) || resumeData?.theme?.fontCssUrl;
    if (savedFamily) {
      applyFontToDoc(doc, savedFamily, savedCssUrl);
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

  // re-apply accent/font whenever they change externally (e.g., saved value)
  useEffect(() => {
    if (docRef.current && resumeData?.theme?.accent) {
      applyAccentToDoc(docRef.current, resumeData.theme.accent);
    }
  }, [resumeData?.theme?.accent, applyAccentToDoc]);

  useEffect(() => {
    if (docRef.current && (resumeData?.theme?.fontFamily || resumeData?.theme?.fontCssUrl)) {
      applyFontToDoc(docRef.current, resumeData.theme.fontFamily, resumeData.theme.fontCssUrl);
    }
  }, [resumeData?.theme?.fontFamily, resumeData?.theme?.fontCssUrl]);

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
