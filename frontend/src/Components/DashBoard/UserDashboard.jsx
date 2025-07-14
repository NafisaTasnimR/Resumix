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
  const skillsRef = useRef(null);
  const achievementsRef = useRef(null);
  const referencesRef = useRef(null);
  const hobbiesRef = useRef(null);
  const additonalsRef = useRef(null);

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
          <Link to="/resumeview" className="resume-name-link">Nishat_Tasnim_Resume</Link>
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
          <div className="sidebar-item" onClick={() => scrollToSection(skillsRef)}>
            Skills
          </div>
          <div className="sidebar-item" onClick={() => scrollToSection(achievementsRef)}>
            Achievements
          </div>
          <div className="sidebar-item" onClick={() => scrollToSection(referencesRef)}>
            References
          </div>
          <div className="sidebar-item" onClick={() => scrollToSection(hobbiesRef)}>
            Hobbies
          </div>
          <div className="sidebar-item" onClick={() => scrollToSection(additonalsRef)}>
            Additional Info
          </div>
        </div>

        <div className="info-wrapper">
          <h2 className="info-main-header">YOUR INFORMATION</h2>
          <div className="info-section">
            <div className="info-box" ref={personalRef}>
              <h3>Personal Information</h3>
              <div className="info-line">Name:</div>
              <div className="info-line">Email:</div>
              <div className="info-line">Date of Birth:</div>
              <div className="info-line">Phone:</div>
              <div className="info-line">Address:</div>
              <div className="info-line">City:</div>
              <div className="info-line">District:</div>
              <div className="info-line">Country:</div>
            </div>
            <div className="info-box" ref={educationRef}>
              <h3>Education Information</h3>
              <div className="info-line">School Name:</div>
              <div className="info-line">Degree:</div>
              <div className="info-line">Field of Study:</div>
              <div className="info-line">Graduation:</div>
              <div className="info-line">City:</div>
              <div className="info-line">State:</div>
              <div className="info-line">Start Date:</div>
              <div className="info-line">End Date:</div>
            </div>
            <div className="info-box" ref={experienceRef}>
              <h3>Experience</h3>
              <div className="info-line">Employer Name:</div>
              <div className="info-line">Job Title:</div>
              <div className="info-line">City:</div>
              <div className="info-line">State:</div>
              <div className="info-line">Start Date:</div>
              <div className="info-line">End Date:</div>
              <div className="info-line">Job Description:</div>
            </div>

            <div className="info-box" ref={skillsRef}>
              <h3>Skills</h3>
              <div className="info-line">Skill Name: </div>
              <div className="info-line">Proficiency Level: </div>
              <div className="info-line">Years of Experience: </div>
              <div className="info-line">Description: </div>
            </div>

            {/* Achievements block */}
            <div className="info-box" ref={achievementsRef}>
              <h3>Achievements</h3>
              <div className="info-line">Title: </div>
              <div className="info-line">Organization: </div>
              <div className="info-line">Date Received: </div>
              <div className="info-line">Category: </div>
              <div className="info-line">Description: </div>
              <div className="info-line">Link: </div>
            </div>

            {/* References block */}
            <div className="info-box" ref={referencesRef}>
              <h3>References</h3>
              <div className="info-line">First Name: </div>
              <div className="info-line">Last Name: </div>
              <div className="info-line">Job Title: </div>
              <div className="info-line">Company: </div>
              <div className="info-line">Email: </div>
              <div className="info-line">Phone: </div>
              <div className="info-line">Relationship: </div>
              <div className="info-line">How do you know this person?: </div>
            </div>

            {/* Hobbies block */}
            <div className="info-box" ref={hobbiesRef}>
              <h3>Hobbies</h3>
              <div className="info-line">Hobby Name: </div>
              <div className="info-line">Experience Level: </div>
              <div className="info-line">Years Involved: </div>
              <div className="info-line">Category: </div>
              <div className="info-line">Description: </div>
              <div className="info-line">Achievements: </div>
            </div>
            <div className="info-box" ref={additonalsRef}>
              <h3>Additional Information</h3>
              <div className="info-line">Section Title:</div>
              <div className="info-line">Information:</div>
            </div>

          </div>
        </div>
      </div>

      <Link to="/profile">
        <button className="update-info-btn">Update your information →</button>
      </Link>
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
