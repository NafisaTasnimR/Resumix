import React, { useState, useRef, useEffect, useCallback } from 'react';
import './UserDashboard.css';
import { Link, useNavigate } from 'react-router-dom';
import ShareResumeModal from '../ResumeListPage/ShareResumeModal';
import DownloadResumeModal from '../ResumeListPage/DownloadResumeModal';
import TopBar from '../ResumeEditorPage/TopBar';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

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

  const [resumes, setResumes] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [resumeError, setResumeError] = useState(null);
  const [localScores, setLocalScores] = useState({});
  const navigate = useNavigate();

  const location = useLocation();
  useEffect(() => {
    if (location.state?.updatedScore) {
      const { id, score } = location.state.updatedScore;
      setLocalScores(prev => ({ ...prev, [id]: score }));
    }
  }, [location.state]);

  useEffect(() => {
    const token = localStorage.getItem('token');

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

    const fetchResumes = async () => {
      try {
        setLoadingResumes(true);
        setResumeError(null);

        // Assumes your controller exposes GET /api/resumes -> array of resumes owned by req.user
        const res = await axios.get('http://localhost:5000/resume/all', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        // If your API returns {resumes: [...]}, use res.data.resumes
        const list = Array.isArray(res.data?.resumes) ? res.data.resumes : res.data;
        setResumes(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error('Failed to fetch resumes:', err);
        setResumeError('Could not load your resumes.');
      } finally {
        setLoadingResumes(false);
      }
    };


    fetchUser();
    fetchResumes();
  }, []);

  if (!user) return <p>Loading...</p>;


  const handleShareClick = (resume) => {
    setResumeName(resume.title || 'Untitled Resume');
    setIsShareModalOpen(true);
  };

  /*const handleDownloadClick = (resume) => {
    setResumeName(resume.name);
    setDownloadLink(`https://myresume.com/${resume.name}_Resume.pdf`);

    setIsDownloadModalOpen(true);
  };*/

  const handleCloseModal = () => {
    setIsShareModalOpen(false);
    setIsDownloadModalOpen(false);
  };

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  const fmt = (d) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '—');

  const handleDownloadClick = async (resume) => {
    try {
      const token = localStorage.getItem('token') || '';
      const res = await axios.get(`http://localhost:5000/download/resume/${resume._id}/pdf`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` },
      });
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(resume.title || 'resume')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Could not download PDF');
    }
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

        {loadingResumes && (
          <div className="resume-table-row">
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading your resumes…</p>
            </div>
          </div>
        )}

        {resumeError && (
          <div className="resume-table-row"><span>{resumeError}</span></div>
        )}

        {!loadingResumes && !resumeError && resumes.length === 0 && (
          <div className="resume-table-row"><span>No resumes yet. Create one!</span></div>
        )}

        {!loadingResumes && !resumeError && resumes.map((r) => (
          <div className="resume-table-row" key={r._id}>
            {/* Clicking the title navigates to the specific resume view */}
            <button
              className="resume-name-link"
              onClick={() => navigate(`/resumeview/${r._id}`)}
              title="Open resume"
            >
              {r.title || 'Untitled'}
            </button>

            {/* If you have updatedAt via timestamps, show it; else fallback to createdAt */}
            <span>{fmt(r.updatedAt || r.createdAt)}</span>
            <span>{fmt(r.createdAt)}</span>

            {/* Strength placeholder (put your actual score here if available) */}
            <span className="strength-badge">
              {localScores[r._id] ?? (Number.isFinite(r.atsScore) ? r.atsScore : '—')}
            </span>

            <span className="actions">
              <button onClick={() => handleDownloadClick(r)}>Download</button>
              <button onClick={() => handleShareClick(r)}>Link</button>
              <button onClick={() => navigate('/m/atschecker', { state: { resumeId: r._id } })}>
                ATS Check
              </button>

              {/* You can also offer a copy-link-to-preview:
                  <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/resumeview/${r._id}`)}>Copy Link</button>
               */}
            </span>
          </div>
        ))}
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
