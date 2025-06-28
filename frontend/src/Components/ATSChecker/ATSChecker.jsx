import React, { useState } from 'react';
import './ATSChecker.css';

const ATSChecker = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [expandedSections, setExpandedSections] = useState({});

  const handleJobDescriptionChange = (e) => {
    setJobDescription(e.target.value);
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleSampleJobPost = (e) => {
    e.preventDefault();
    const sampleJob = `Senior Software Engineer - Full Stack

We are looking for a Senior Software Engineer to join our dynamic team. You will be responsible for developing and maintaining web applications using modern technologies.

Requirements:
- 5+ years of experience in full-stack development
- Proficiency in JavaScript, React, Node.js
- Experience with cloud platforms (AWS, Azure)
- Strong problem-solving skills
- Bachelor's degree in Computer Science or related field

Responsibilities:
- Design and develop scalable web applications
- Collaborate with cross-functional teams
- Write clean, maintainable code
- Participate in code reviews
- Mentor junior developers

We offer competitive salary, health benefits, and flexible working arrangements.`;
    
    setJobDescription(sampleJob);
  };

  const handleGetInsights = () => {
    if (jobDescription.trim()) {
      alert('Analyzing job description...\n\nThis would typically generate tailored insights based on the job requirements and compare them with your resume content.');
    }
  };

  const handleMetricClick = (metric) => {
    alert(`This would expand to show detailed breakdown of the ${metric} metric.`);
  };

  const metricsData = [
    { label: 'TAILORING', value: '100%', type: 'percentage-100' },
    { label: 'CONTENT', value: '70%', type: 'percentage-70' },
    { label: 'ATS Parse Rate', icon: '✓', status: 'status-good' },
    { label: 'Quantifying Impact', icon: '⚠', status: 'status-warning' },
    { label: 'Repetition', icon: '✓', status: 'status-good' },
    { label: 'Spelling & Grammar', icon: '⚠', status: 'status-warning' },
    { label: 'FORMAT', value: '40%', type: 'percentage-40' },
    { label: 'SECTIONS', value: '89%', type: 'percentage-89' },
    { label: 'STYLE', value: '86%', type: 'percentage-86' }
  ];

  const sectionsData = [
    {
      id: 'content',
      name: 'CONTENT',
      score: '70%',
      scoreClass: 'percentage-70',
      description: 'Your content analysis shows room for improvement in several key areas. Focus on quantifying your achievements with specific metrics and numbers.',
      issues: [
        { type: 'warning', text: 'Add more quantified achievements to demonstrate impact' },
        { type: 'warning', text: 'Include industry-specific keywords from job description' },
        { type: 'error', text: 'Remove redundant information between sections' }
      ]
    },
    {
      id: 'format',
      name: 'FORMAT',
      score: '40%',
      scoreClass: 'percentage-40',
      description: 'Your resume format needs significant improvements to ensure ATS compatibility and professional appearance.',
      issues: [
        { type: 'error', text: 'Use standard section headers (Experience, Education, Skills)' },
        { type: 'error', text: 'Ensure consistent font sizes and spacing' },
        { type: 'warning', text: 'Optimize white space for better readability' }
      ]
    },
    {
      id: 'sections',
      name: 'SECTIONS',
      score: '89%',
      scoreClass: 'percentage-89',
      description: 'Great job! Your resume has most of the essential sections. Consider adding a few optional sections to stand out.',
      issues: [
        { type: 'good', text: 'Professional experience section is well-structured' },
        { type: 'good', text: 'Education section includes relevant details' },
        { type: 'warning', text: 'Consider adding a "Projects" or "Certifications" section' }
      ]
    }
  ];

  return (
    <div className="ats-resume-checker">
      <header className="header">
        <div className="header-content">
        </div>
      </header>

      <div className="main-container">
        <aside className="sidebar">
          <div className="score-section">
            <h2 className="score-title">Your Score</h2>
            <div className="score-display">72/100</div>
            <div className="issues-count">11 Issues</div>
          </div>

          <div className="metrics-section">
            {metricsData.map((metric, index) => (
              <div key={index} className="metric-item">
                <div className="metric-label">
                  {metric.icon && (
                    <span className={`status-icon ${metric.status}`}>
                      {metric.icon}
                    </span>
                  )}
                  {metric.label}
                </div>
                <div className="metric-value">
                  {metric.value && (
                    <>
                      <span className={`percentage ${metric.type}`}>
                        {metric.value}
                      </span>
                      <span 
                        className="chevron"
                        onClick={() => handleMetricClick(metric.label)}
                      >
                        ▼
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button className="btn btn-primary unlock-btn">
            Unlock Full Report 🚀
          </button>
        </aside>

        <main className="main-content">
          <div className="content-header">
            <div className="content-icon">🎯</div>
            <div>
              <h1 className="content-title">RESUME TAILORING</h1>
              <p className="content-subtitle">
                Paste <strong>the job you're applying for</strong> and our checker will give you job-specific resume tailoring suggestions.
              </p>
            </div>
          </div>

          <div className="content-body">
            <div className="job-input-section">
              <label className="input-label">Get a job-specific report</label>
              <div className="job-input-container">
                <textarea 
                  className="job-textarea" 
                  placeholder="Paste job description here..."
                  value={jobDescription}
                  onChange={handleJobDescriptionChange}
                />
              </div>
              <div className="input-actions">
                <a href="#" className="sample-job-link" onClick={handleSampleJobPost}>
                  📄 Use a Sample Job Post
                </a>
                <button 
                  className={`btn ${jobDescription.trim() ? 'btn-primary' : 'get-insights-btn'}`}
                  disabled={!jobDescription.trim()}
                  onClick={handleGetInsights}
                >
                  🎯 Get Tailored Insights
                </button>
              </div>
            </div>

            <div className="skills-section">
              <div className="skills-header">
                <h3 className="skills-title">
                  🔒 HARD SKILLS
                </h3>
                <div className="premium-badge">
                  ⭐ PREMIUM
                </div>
              </div>

              {sectionsData.map((section) => (
                <div key={section.id} className="expandable-section">
                  <div 
                    className="section-header" 
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="section-title-with-score">
                      <span>{section.name}</span>
                      <span className={`section-score ${section.scoreClass}`}>
                        {section.score}
                      </span>
                    </div>
                    <span className={`chevron ${expandedSections[section.id] ? 'expanded' : ''}`}>
                      ▼
                    </span>
                  </div>
                  <div className={`section-content ${expandedSections[section.id] ? 'expanded' : ''}`}>
                    <p style={{ color: '#4a5568', lineHeight: '1.6' }}>
                      {section.description}
                    </p>
                    <ul className="issue-list">
                      {section.issues.map((issue, index) => (
                        <li key={index} className="issue-item">
                          <span className={`status-icon status-${issue.type}`}>
                            {issue.type === 'good' ? '✓' : issue.type === 'warning' ? '⚠' : '✗'}
                          </span>
                          <span>{issue.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="bottom-actions">
              <button className="btn edit-fix-btn">Edit & Fix Resume</button>
              <button className="btn delete-btn">Permanently Delete Report Data</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ATSChecker;