import React from 'react';
import './ResumeViewPage.css';

const ResumeViewPage = () => {
  return (
    <div className="resume-page-container">
      <header className="resume-header">
        <h1 className="resume-title">Nishat_Tasnim_Resume</h1>
        <button className="edit-btn">Edit</button>
      </header>
      <div className="resume-image-container">
        <img
          src=""
          alt="Resume Preview"
          className="resume-image"
        />
      </div>
    </div>
  );
};

export default ResumeViewPage;
