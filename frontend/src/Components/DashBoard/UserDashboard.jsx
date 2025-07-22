import React, { useState, useRef, useEffect } from 'react';
import './UserDashboard.css';
import { Link } from 'react-router-dom';
import ShareResumeModal from '../ResumeListPage/ShareResumeModal';
import DownloadResumeModal from '../ResumeListPage/DownloadResumeModal';
import TopBar from '../ResumeEditorPage/TopBar';
import axios from 'axios';

const Dashboard = () => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [resumeName, setResumeName] = useState('Nishat_Tasnim_Resume');
  const [downloadLink, setDownloadLink] = useState('https://myresume.com/resume12345.pdf');
  const [user, setUser] = useState(null);

  const personalRef = useRef(null);
  const educationRef = useRef(null);
  const experienceRef = useRef(null);
  const skillsRef = useRef(null);
  const achievementsRef = useRef(null);
  const referencesRef = useRef(null);
  const hobbiesRef = useRef(null);
  const additonalsRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/viewInformation/userInformation', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []);

  if (!user) return <p>Loading...</p>;


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
      <TopBar />
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
            Personal Information
          </div>
          <div className="sidebar-item" onClick={() => scrollToSection(educationRef)}>
            Education Information
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
            Additional Information
          </div>
        </div>

        <div className="info-wrapper">
          <h2 className="info-main-header">YOUR INFORMATION</h2>
          <div className="info-section">
            {/* Personal Information */}
            <div className="info-box" ref={personalRef}>
              <h3>Personal Information of {user.username}</h3>
              <div className="info-line">Name: {user.defaultResumeData?.personalInfo?.fullName}</div>
              <div className="info-line">Email: {user.defaultResumeData?.personalInfo?.professionalEmail}</div>
              <div className="info-line">Date of Birth: {new Date(user.defaultResumeData?.personalInfo?.dateOfBirth).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
              <div className="info-line">Phone: {user.defaultResumeData?.personalInfo?.phone}</div>
              <div className="info-line">Address: {user.defaultResumeData?.personalInfo?.address}</div>
              <div className="info-line">City: {user.defaultResumeData?.personalInfo?.city}</div>
              <div className="info-line">District: {user.defaultResumeData?.personalInfo?.district}</div>
              <div className="info-line">Country: {user.defaultResumeData?.personalInfo?.country}</div>
            </div>

            {/* Education */}
            <div className="info-box" ref={educationRef}>
              <h3>Education Information</h3>
              {user.defaultResumeData?.education?.map((edu, index) => (
                <div key={index}>
                  <div className="info-line">School Name: {edu.institution}</div>
                  <div className="info-line">Degree: {edu.degree}</div>
                  <div className="info-line">Field of Study: {edu.fieldOfStudy}</div>
                  <div className="info-line">Graduation: {edu.graduationDate}</div>
                  <div className="info-line">City: {edu.city}</div>
                  <div className="info-line">State: {edu.state}</div>
                  <div className="info-line">Start Date: {edu.startDate}</div>
                  <div className="info-line">End Date: {edu.endDate}</div>
                </div>
              ))}
            </div>

            {/* Experience */}
            <div className="info-box" ref={experienceRef}>
              <h3>Experience</h3>
              {user.defaultResumeData?.experience?.map((exp, index) => (
                <div key={index}>
                  <div className="info-line">Employer Name: {exp.employerName}</div>
                  <div className="info-line">Job Title: {exp.jobTitle}</div>
                  <div className="info-line">City: {exp.city}</div>
                  <div className="info-line">State: {exp.state}</div>
                  <div className="info-line">Start Date: {exp.startDate}</div>
                  <div className="info-line">End Date: {exp.endDate}</div>
                  <div className="info-line">Job Description: {exp.description}</div>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className="info-box" ref={skillsRef}>
              <h3>Skills</h3>
              {user.defaultResumeData?.skills?.map((skill, index) => (
                <div key={index}>
                  <div className="info-line">Skill Name: {skill.skillName}</div>
                  <div className="info-line">Proficiency Level: {skill.proficiencyLevel}</div>
                  <div className="info-line">Years of Experience: {skill.yearsOfExperience}</div>
                  <div className="info-line">Description: {skill.skillDescription}</div>
                </div>
              ))}
            </div>

            {/* Achievements */}
            <div className="info-box" ref={achievementsRef}>
              <h3>Achievements</h3>
              {user.defaultResumeData?.achievements?.map((ach, index) => (
                <div key={index}>
                  <div className="info-line">Title: {ach.title}</div>
                  <div className="info-line">Organization: {ach.organization}</div>
                  <div className="info-line">Date Received: {ach.dateReceived}</div>
                  <div className="info-line">Category: {ach.category}</div>
                  <div className="info-line">Description: {ach.description}</div>
                  <div className="info-line">Link: {ach.website}</div>
                </div>
              ))}
            </div>

            {/* References */}
            <div className="info-box" ref={referencesRef}>
              <h3>References</h3>
              {user.defaultResumeData?.references?.map((ref, index) => (
                <div key={index}>
                  <div className="info-line">First Name: {ref.firstName}</div>
                  <div className="info-line">Last Name: {ref.lastName}</div>
                  <div className="info-line">Job Title: {ref.jobTitle}</div>
                  <div className="info-line">Company: {ref.company}</div>
                  <div className="info-line">Email: {ref.referenceEmail}</div>
                  <div className="info-line">Phone: {ref.phone}</div>
                  <div className="info-line">Relationship: {ref.relationship}</div>
                  <div className="info-line">How do you know this person?: {ref.customeRelationship}</div>
                </div>
              ))}
            </div>

            {/* Hobbies */}
            <div className="info-box" ref={hobbiesRef}>
              <h3>Hobbies</h3>
              {user.defaultResumeData?.hobbies?.map((hob, index) => (
                <div key={index}>
                  <div className="info-line">Hobby Name: {hob.hobbyName}</div>
                  <div className="info-line">Experience Level: {hob.experienceLevel}</div>
                  <div className="info-line">Years Involved: {hob.yearsInvolved}</div>
                  <div className="info-line">Category: {hob.category}</div>
                  <div className="info-line">Description: {hob.hobbyDescription}</div>
                  <div className="info-line">Achievements: {hob.achievements}</div>
                </div>
              ))}
            </div>

            {/* Additional Information */}
            <div className="info-box" ref={additonalsRef}>
              <h3>Additional Information</h3>
              {user.defaultResumeData?.additionalInfos?.map((info, index) => (
                <div key={index}>
                  <div className="info-line">Section Title: {info.sectionTitle}</div>
                  <div className="info-line">Information: {info.content}</div>
                </div>
              ))}
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
