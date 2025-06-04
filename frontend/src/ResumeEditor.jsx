import React, { useState } from 'react';

const ResumeEditor = () => {
  const [title, setTitle] = useState('Untitled');
  const [titleDropdownOpen, setTitleDropdownOpen] = useState(false);
  const [progressOpen, setProgressOpen] = useState(true);

  const toggleTitleEdit = () => setTitleDropdownOpen(!titleDropdownOpen);
  const toggleProgressLine = () => setProgressOpen(!progressOpen);
  const saveTitle = (e) => {
    e.stopPropagation();
    const value = document.getElementById('titleInput').value;
    setTitle(value || 'Untitled');
    setTitleDropdownOpen(false);
  };

  return (
    <div className="main">
      <div className="title-edit">
        <div className="title-edit-bar" onClick={toggleTitleEdit}>
          <span className="title-text" id="titleDisplay">{title}</span>
          <button className="arrow-btn">{titleDropdownOpen ? '▲' : '▼'}</button>
        </div>
        {titleDropdownOpen && (
          <div className="title-edit-dropdown active" id="titleDropdown">
            <input type="text" id="titleInput" defaultValue={title} />
            <button className="edit-btn" onClick={saveTitle}>Edit</button>
          </div>
        )}
      </div>

      <div className="question-box">
        <label htmlFor="work-exp">Your Work Experience?</label>
        <textarea id="work-exp" defaultValue="Worked"></textarea>
      </div>

      <div className="progress">
        <div className="progress-line-header" onClick={toggleProgressLine}>
          <span className="progress-title">Progress Line</span>
          <button className="arrow-btn-progress">{progressOpen ? '▲' : '▼'}</button>
        </div>
        <div className={`progress-line${progressOpen ? ' active' : ''}`} id="progressLineDropdown">
          <span>--</span>
          <div className="circle">2</div>
          <span>--</span>
          <div className="circle active">PLI</div>
          <span>--</span>
          <div className="circle">4</div>
          <span>--</span>
        </div>
      </div>

      <div className="nav-buttons">
        <button>&larr;</button>
        <button>Edit</button>
        <button>Skip</button>
        <button>&rarr;</button>
      </div>
    </div>
  );
};

export default ResumeEditor;