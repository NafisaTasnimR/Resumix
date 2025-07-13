import React, { useState, useRef } from 'react';
import './UserDashboard.css';
import { Link } from 'react-router-dom';
import ShareResumeModal from '../ResumeListPage/ShareResumeModal';
import DownloadResumeModal from '../ResumeListPage/DownloadResumeModal';

const Dashboard = () => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [resumeName, setResumeName] = useState('Nishat_Tasnim_Resume');
  const [downloadLink, setDownloadLink] = useState('https://myresume.com/resume12345.pdf');

  const personalRef = useRef(null);
  const educationRef = useRef(null);
  const experienceRef = useRef(null);

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const handleDownloadClick = (resume) => {
    setResumeName(resume.name);
    setDownloadLink(`https://myresume.com/${resume.name}_Resume.pdf`);
    setIsDownloadModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsShareModalOpen(false);
    setIsDownloadModalOpen(false);
  };

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

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
        <div className="resume-table-row">
          <span>Nishat_Tasnim_Resume</span>
          <span>5/16/2025</span>
          <span>5/14/2025</span>
          <span className="strength-badge">45</span>
          <span className="actions">
            <button onClick={() => handleDownloadClick({ name: 'Nishat_Tasnim_Resume' })}>Download</button>
            <button onClick={() => handleShareClick()}>Link</button>
          </span>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="sidebar">
          <div className="sidebar-item" onClick={() => scrollToSection(personalRef)}>
            Personal Info
          </div>
          <div className="sidebar-item" onClick={() => scrollToSection(educationRef)}>
            Education Info
          </div>
          <div className="sidebar-item" onClick={() => scrollToSection(experienceRef)}>
            Experience
          </div>
        </div>

        <div className="info-wrapper">
          <h2 className="info-main-header">YOUR INFORMATION</h2>

          <div className="info-section">
            <div id="personal" className="info-block" ref={personalRef}>
              <h3>Personal Information</h3>
              <p><strong>Name:</strong></p>
              <p><strong>Email:</strong></p>
              <p><strong>Date of Birth:</strong></p>
              <p><strong>Phone:</strong></p>
              <p><strong>Address:</strong></p>
              <p><strong>City:</strong></p>
              <p><strong>District:</strong></p>
              <p><strong>Country:</strong></p>
            </div>

            <div id="education" className="info-block" ref={educationRef}>
              <h3>Education Information</h3>
              <p><strong>School Name:</strong></p>
              <p><strong>Degree:</strong></p>
              <p><strong>Field of Study:</strong></p>
              <p><strong>Graduation:</strong></p>
              <p><strong>City:</strong></p>
              <p><strong>State:</strong></p>
              <p><strong>Start Date:</strong></p>
              <p><strong>End Date:</strong></p>
            </div>

            <div id="experience" className="info-block" ref={experienceRef}>
              <h3>Experience</h3>
              <p><strong>Employer Name:</strong></p>
              <p><strong>Job Title:</strong></p>
              <p><strong>City:</strong></p>
              <p><strong>State:</strong></p>
              <p><strong>Start Date:</strong></p>
              <p><strong>End Date:</strong></p>
              <p><strong>Job Description:</strong></p>
            </div>
          </div>
        </div>
      </div>

      <ShareResumeModal 
        isOpen={isShareModalOpen} 
        onClose={handleCloseModal} 
      />
      <DownloadResumeModal 
        isOpen={isDownloadModalOpen} 
        onClose={handleCloseModal} 
        resumeName={resumeName} 
        downloadLink={downloadLink} 
      />
    </div>
  );
};

export default Dashboard;
