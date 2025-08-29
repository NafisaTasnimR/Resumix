import React, { useState, useEffect } from "react";
import "./ShareResumeModal.css";

const ShareResumeModal = ({ isOpen, onClose, resumeLink, resumeName, error }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) setCopied(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const value = error ? "" : (resumeLink || "");

  const copy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      const el = document.createElement("textarea");
      el.value = value;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close">×</button>

        <div className="modal-header">
          <h3>Share Your Resume {resumeName ? `— ${resumeName}` : ""}</h3>
        </div>

        <div className="modal-body">
          {error ? (
            <p className="error-text">{error}</p>
          ) : (
            <>
              <p>Anyone with this link can view your resume:</p>
              <input
                type="text"
                readOnly
                value={value}
                className="resume-link"
                placeholder="Generating link…"
              />
              <div className="modal-actions">
                <button className="copy-btn" onClick={copy} disabled={!value}>
                  {copied ? "Copied!" : "Copy Link"}
                </button>
                <a
                  className="open-link-btn"
                  href={value || "#"}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => !value && e.preventDefault()}
                >
                  Open Link
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareResumeModal;
