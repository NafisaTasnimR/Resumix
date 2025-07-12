import React from 'react';
import './DownloadResumeModal.css';

const DownloadResumeModal = ({ isOpen, onClose, resumeName, downloadLink, imgSrc }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>x</button>
        <div className="modal-header">
          <h3>Download Your Resume</h3>
        </div>
        {/* Image added here */}
        <div className="modal-image">
          <img src="/pdf.png" alt="Resume Preview" />
        </div>
        <div className="modal-body">
          <p>{resumeName}.pdf</p>
          <a href={downloadLink} download>
            <button className="download-btn">Download</button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default DownloadResumeModal;
