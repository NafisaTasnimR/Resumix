import React from 'react';
import './ShareResumeModal.css';

const ShareResumeModal = ({ isOpen, onClose, resumeLink }) => {
  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(resumeLink);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>x</button>
        <div className="modal-header">
          <h3>Share Your Resume</h3>
        </div>
        <div className="modal-body">
          <p>Here is your unique resume link:</p>
          <input
            type="text"
            readOnly
            value={resumeLink}
            className="resume-link"
          />
          <button className="copy-btn" onClick={handleCopy}>Copy Link</button>
        </div>
      </div>
    </div>
  );
};

export default ShareResumeModal;
