import React from 'react';
import './ResumeListPage.css';
import { Link } from 'react-router-dom';

const ResumeListPage = () => {
  const resumes = [
    {
      name: 'Nishat_Tasnim_R...',
      modificationDate: '5/16/2025',
      creationDate: '5/14/2025',
      strength: 45,
    },
  ];

  return (
    <div className="resume-fullpage">
      <div className="resume-header">
        <h2>My Resumes</h2>
        <div className="header-actions">
          <Link to="/resumebuilder" className="create-btn">Create New Resume</Link>
        </div>
      </div>

      <div className="resume-table">
        <div className="resume-table-header">
          <span>MY RESUMES</span>
          <span>MODIFICATION</span>
          <span>CREATION</span>
          <span>STRENGTH</span>
          <span>ACTIONS</span>
        </div>
        {resumes.map((resume, index) => (
          <div className="resume-table-row" key={index}>
            <span>{resume.name}</span>
            <span>{resume.modificationDate}</span>
            <span>{resume.creationDate}</span>
            <span className="strength-badge">{resume.strength}</span>
          
            <span className="actions">

            <Link to="">Edit</Link>
            <Link to="">Download</Link>
            <Link to="">Link</Link>
            <Link to="">Remove</Link>
            </span>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeListPage;
