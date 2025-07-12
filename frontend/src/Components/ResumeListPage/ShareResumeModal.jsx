import React from 'react';
import './ShareResumeModal.css';

const ShareResumeModal = ({ isOpen, onClose, resumeLink }) => {
  if (!isOpen) return null;

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
            value="Your unique resume link will appear here"
            className="resume-link"
          />
          <button className="copy-btn" onClick={() => { /* Copy link functionality */ }}>
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareResumeModal;
