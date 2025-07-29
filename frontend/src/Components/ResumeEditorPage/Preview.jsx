import React, { useEffect, useRef, useState } from "react";

const Preview = ({ renderedHtml = "", templateCss = "" }) => {
  const iframeRef = useRef(null);
  const [scaleFactor, setScaleFactor] = useState(1);

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(`
          <html>
            <head>
              <style>${templateCss}</style>
              <style>
                html, body { margin: 0; padding: 0; overflow: hidden; }
                #template-root { transform-origin: top left; }
              </style>
            </head>
            <body>
              <div id="template-root">${renderedHtml}</div>
            </body>
          </html>
        `);
        doc.close();

        iframeRef.current.onload = () => {
          const root = doc.getElementById("template-root");
          const height = root.scrollHeight || 1000;
          const maxPreviewHeight = 600;
          const scale = Math.min(1, maxPreviewHeight / height);
          root.style.transform = `scale(${scale})`;
          setScaleFactor(scale); // Optional if you want to display scale info
        };
      }
    }
  }, [renderedHtml, templateCss]);

  return (
    <div className="preview">
      <div className="preview-box" style={{ width: "100%", height: "600px", overflow: "hidden" }}>
        <iframe
          title="Resume Preview"
          ref={iframeRef}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            background: "#fff",
          }}
        />
      </div>
    </div>
  );
};

export default Preview;