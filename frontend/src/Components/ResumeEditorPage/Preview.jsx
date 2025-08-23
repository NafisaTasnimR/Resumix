import React, { useEffect, useRef } from "react";

const Preview = ({ renderedHtml = "", templateCss = "", onSectionClick }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!iframeRef.current || !renderedHtml) return;

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    // Write a full, valid HTML doc into the iframe
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${templateCss || ""}</style>
          <style>
            * { box-sizing: border-box; }
            html, body {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              overflow: hidden;   /* no scrollbars in the thumbnail */
              background: #fff;
            }
            /* The original, unscaled resume page (A4-ish) */
            #template-root {
              width: 210mm;               /* ~794px @ 96dpi */
              min-height: 297mm;          /* ~1123px */
              margin: 0 auto;
              background: white;
              transform-origin: top left; /* IMPORTANT for scaling math */
            }
          </style>
        </head>
        <body>
          <div id="template-root">${renderedHtml}</div>
        </body>
      </html>
    `);
    doc.close();

    const root = () => doc.getElementById("template-root");

    // Recompute scale to fit BOTH width & height of the preview box
    const recalcScale = () => {
      const el = root();
      if (!el) return;

      // Unscaled content size
      const contentWidth = el.scrollWidth || el.getBoundingClientRect().width || 794;
      const contentHeight = el.scrollHeight || el.getBoundingClientRect().height || 1123;

      // Available space inside the preview box (the iframe element itself)
      const availWidth = iframe.clientWidth || iframe.getBoundingClientRect().width;
      const availHeight = iframe.clientHeight || iframe.getBoundingClientRect().height;

      const scale = Math.min(availWidth / contentWidth, availHeight / contentHeight, 1);

      // Apply the scale and make the iframe document tall enough so nothing is clipped
      el.style.transform = `scale(${scale})`;
      // Give the iframe doc enough height for the scaled content
      const scaledH = Math.ceil(contentHeight * scale);
      doc.body.style.height = `${scaledH}px`;
      doc.documentElement.style.height = `${scaledH}px`;
    };

    // Initial compute once the iframe lays out
    const onLoad = () => {
      recalcScale();

      // Click-to-focus section mapping (same as your code)
      doc.addEventListener("click", (e) => {
        const target = e.target.closest?.("[data-edit-id]");
        if (!target) return;

        const path = target.getAttribute("data-edit-id") || "";
        if (!path) return;

        // break "experience[0].jobTitle" → ["experience","0","jobTitle"]
        const tokens = path.split(/[\.\[\]]/).filter(Boolean);
        let section = tokens[0] || "";
        const field = tokens[tokens.length - 1] || "";

        // normalize section ids to your editor’s names
        if (section === "personalInfo") section = "personal";
        if (section === "additionalInfos") section = "additional";

        onSectionClick?.({ section, field, path });
      });

      // Recalc on inner DOM mutations (content changes)
      const mo = new MutationObserver(() => recalcScale());
      mo.observe(doc.body, { childList: true, subtree: true, characterData: true });

      // Recalc if the parent window resizes
      window.addEventListener("resize", recalcScale);

      // Cleanup on unmount
      iframe._cleanup = () => {
        mo.disconnect();
        window.removeEventListener("resize", recalcScale);
      };
    };

    // When the iframe finishes painting, compute scale
    iframe.onload = onLoad;

    // If the browser doesn't fire onload (rare), try a delayed recalc
    const fallbackTimer = setTimeout(recalcScale, 50);

    return () => {
      clearTimeout(fallbackTimer);
      iframe._cleanup?.();
    };
  }, [renderedHtml, templateCss, onSectionClick]);

  return (
    <div className="preview">
      {/* Parent preview box controls the final thumbnail size */}
      <div
        className="preview-box"
        style={{ width: "100%", height: 600, overflow: "hidden", borderRadius: 8 }}
      >
        <iframe
          title="Resume Preview"
          ref={iframeRef}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            background: "#fff"
          }}
        />
      </div>
    </div>
  );
};

export default Preview;
