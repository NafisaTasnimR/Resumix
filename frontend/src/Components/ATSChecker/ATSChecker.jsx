import React, { useState } from 'react';
import './ATSChecker.css';
import { useNavigate } from 'react-router-dom';
import TopBar from '../ResumeEditorPage/TopBar';

const ATSChecker = () => {
  const [jobDescription, setJobDescription] = useState('');

  const scoreData = {
    overall: 72,
    totalIssues: 11,
    categories: {
      tailoring: { score: 100, status: 'good' },
      content: { score: 70, status: 'warning' },
      format: { score: 40, status: 'error' },
      sections: { score: 89, status: 'good' },
      style: { score: 86, status: 'good' }
    },
    issues: [
      { name: 'ATS Parse Rate', status: 'good', icon: '✓' },
      { name: 'Quantifying Impact', status: 'warning', icon: '⚠' },
      { name: 'Repetition', status: 'good', icon: '✓' },
      { name: 'Spelling & Grammar', status: 'warning', icon: '⚠' }
    ]
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
            <div className="category-item">
              <div className="category-header">
                <span className="category-name">TAILORING</span>
                <div className="category-score-container">
                  <span 
                    className="category-score"
                    style={{ backgroundColor: getScoreColor(scoreData.categories.tailoring.score) }}
                  >
                    {scoreData.categories.tailoring.score}%
                  </span>
                  <span className="chevron">▼</span>
                </div>
              </div>
            </div>

            <div className="category-item">
              <div className="category-header">
                <span className="category-name">CONTENT</span>
                <div className="category-score-container">
                  <span 
                    className="category-score"
                    style={{ backgroundColor: getScoreColor(scoreData.categories.content.score) }}
                  >
                    {scoreData.categories.content.score}%
                  </span>
                  <span className="chevron">▼</span>
                </div>
              </div>
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

            <div className="category-item">
              <div className="category-header">
                <span className="category-name">FORMAT</span>
                <div className="category-score-container">
                  <span 
                    className="category-score"
                    style={{ backgroundColor: getScoreColor(scoreData.categories.format.score) }}
                  >
                    {scoreData.categories.format.score}%
                  </span>
                  <span className="chevron">▼</span>
                </div>
              </div>
            </div>

            <div className="category-item">
              <div className="category-header">
                <span className="category-name">SECTIONS</span>
                <div className="category-score-container">
                  <span 
                    className="category-score"
                    style={{ backgroundColor: getScoreColor(scoreData.categories.sections.score) }}
                  >
                    {scoreData.categories.sections.score}%
                  </span>
                  <span className="chevron">▼</span>
                </div>
              </div>
            </div>

            <div className="category-item">
              <div className="category-header">
                <span className="category-name">STYLE</span>
                <div className="category-score-container">
                  <span 
                    className="category-score"
                    style={{ backgroundColor: getScoreColor(scoreData.categories.style.score) }}
                  >
                    {scoreData.categories.style.score}%
                  </span>
                  <span className="chevron">▼</span>
                </div>
              </div>
            </div>
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
            
            <div className="action-buttons">
              <button className="sample-job-btn">
                📄 Use a Sample Job Post
              </button>
              <button className="tailored-insights-btn">
                <span className="btn-icon">🎯</span>
                Get Tailored Insights
              </button>
            </div>
          </div>

          <div className="hard-skills-section">
           
            <h3>🔒 HARD SKILLS</h3>
            
            <div className="skills-categories">
              <div className="skill-category">
                <div className="skill-header">
                  <span>CONTENT</span>
                  <div className="skill-right">
                    <span className="skill-score" style={{ backgroundColor: getScoreColor(70) }}>70%</span>
                    <span className="chevron">▼</span>
                  </div>
                </div>
              </div>
              
              <div className="skill-category">
                <div className="skill-header">
                  <span>FORMAT</span>
                  <div className="skill-right">
                    <span className="skill-score" style={{ backgroundColor: getScoreColor(40) }}>40%</span>
                    <span className="chevron">▼</span>
                  </div>
                </div>
              </div>
              
              <div className="skill-category">
                <div className="skill-header">
                  <span>SECTIONS</span>
                  <div className="skill-right">
                    <span className="skill-score" style={{ backgroundColor: getScoreColor(89) }}>89%</span>
                    <span className="chevron">▼</span>
                  </div>
                </div>
              </div>
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