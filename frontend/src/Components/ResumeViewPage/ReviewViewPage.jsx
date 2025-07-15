import React from 'react';
import './ResumeViewPage.css';
import { Link } from 'react-router-dom';
import TopBar from '../ResumeEditorPage/TopBar';

const ResumeViewPage = () => {
  return (
    <div className="resume-page-container">
      <TopBar/>
      <header className="resume-view-header">
        <h1 className="resume-title">Nishat_Tasnim_Resume</h1>
        <Link to="/resumebuilder" className="edit-btn">Edit</Link>
      </header>
      <div className="resume-image-container">
        <img
          src="sampleR.png"
          alt="Resume Preview"
          className="resume-image"
        />
      </div>
    </div>
  );
};

export default ResumeViewPage;
