import React, { useState, useEffect } from 'react';
import './ATSChecker.css';
import { useNavigate } from 'react-router-dom';
import TopBar from '../ResumeEditorPage/TopBar';
import { calculateAtsScore, generateScoreData } from './ATSLogic';
import axios from 'axios';

const ATSChecker = ({ resumeData, resumeId }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [scoreData, setScoreData] = useState(null);

  useEffect(() => {
    if (resumeData) {
      const score = calculateAtsScore(resumeData);
      const generatedScoreData = generateScoreData(score);
      setScoreData(generatedScoreData);

      updateBackendScore(score);
    }
  }, [resumeData]);

  const updateBackendScore = async (score) => {
  try {
    await axios.patch(`/api/resumes/${resumeId}/ats-score`, {
      atsScore: score,
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Error updating ATS score:', err);
  }
};


  const getScoreColor = (score) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return '#10B981';
      case 'warning': return '#F59E0B';
      case 'error': return '#EF4444';
      default: return '#6B7280';
    }
  };

  if (!scoreData)
    return (
      <div className="resume-checker loading-screen">
        <TopBar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Calculating ATS score...</p>
        </div>
      </div>
    );


  return (
    <div className="resume-checker">
      <TopBar />
      <div className="main-container">
        {/* Left Sidebar */}
        <div className="left-sidebar">
          <div className="score-section">
            <h2>Your Score</h2>
            <div className="score-display">
              <span className="score-number">{scoreData.overall}</span>
              <span className="score-total">/100</span>
            </div>
            <p className="issues-count">{scoreData.totalIssues} Issues</p>
          </div>

          <div className="categories-section">
            {Object.entries(scoreData.categories).map(([key, value]) => (
              <div className="category-item" key={key}>
                <div className="category-header">
                  <span className="category-name">{key.toUpperCase()}</span>
                  <div className="category-score-container">
                    <span
                      className="category-score"
                      style={{ backgroundColor: getScoreColor(value.score) }}
                    >
                      {value.score}%
                    </span>
                    <span className="chevron">▼</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="issues-list">
            {scoreData.issues.map((issue, index) => (
              <div key={index} className="issue-item">
                <span
                  className="issue-icon"
                  style={{ color: getStatusColor(issue.status) }}
                >
                  {issue.icon}
                </span>
                <span className="issue-name">{issue.name}</span>
              </div>
            ))}
          </div>

          <button className="unlock-report-btn">
            <span className="btn-icon">🎯</span>
            Unlock Full Report
          </button>
        </div>

        {/* Right Content Area */}
        <div className="content-area">
          <div className="resume-tailoring-section">
            <div className="tailoring-header">
              <div className="tailoring-icon">🎯</div>
              <div className="tailoring-content">
                <h2>RESUME TAILORING</h2>
                <p>Paste <strong>the job you're applying for</strong> and our checker will give you job-specific resume tailoring suggestions.</p>
              </div>
            </div>
          </div>

          <div className="job-report-section">
            <h3>Get a job-specific report</h3>
            <textarea
              className="job-description-input"
              placeholder="Paste job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <div className="hard-skills-section">
            <h3>🔒 HARD SKILLS</h3>
            <div className="skills-categories">

            </div>
          </div>

          <div className="bottom-actions">
            <button className="edit-resume-btn">Edit & Fix Resume</button>
            <button className="delete-data-btn">Permanently Delete Report Data</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSChecker;