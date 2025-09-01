import React from 'react';
import './DownloadResumeModal.css';

const safe = (s) =>
  (s || 'resume').replace(/[\/\\?%*:|"<>]/g, '-').replace(/\s+/g, ' ').trim();

const DownloadResumeModal = ({ isOpen, onClose, resumeName, downloadLink, imgSrc }) => {
  if (!isOpen) return null;

  const finalName = `${safe(resumeName)}.pdf`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>x</button>
        <div className="modal-header">
          <h3>Download Your Resume</h3>
        </div>

        <div className="modal-image">
          <img src="/pdf.png" alt="Resume Preview" />
        </div>

        <div className="modal-body">
          <p>{finalName}</p>
          <a href={downloadLink} download={finalName}>
            <button type="button" className="download-btn">Download</button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default DownloadResumeModal;
