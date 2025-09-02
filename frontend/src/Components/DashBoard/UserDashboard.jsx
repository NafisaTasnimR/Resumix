import React, { useState, useRef, useEffect, useCallback } from 'react';
import './UserDashboard.css';
import { Link, useNavigate } from 'react-router-dom';
import ShareResumeModal from '../ResumeListPage/ShareResumeModal';
import DownloadResumeModal from '../ResumeListPage/DownloadResumeModal';
import TopBar from '../ResumeEditorPage/TopBar';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const API_BASE = (import.meta.env && import.meta.env.VITE_API_BASE) || "http://localhost:5000";


const Dashboard = () => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [resumeName, setResumeName] = useState('Nishat_Tasnim_Resume');
  const [downloadLink, setDownloadLink] = useState('https://myresume.com/resume12345.pdf');
  const [user, setUser] = useState(null);

  // Subscription and usage tracking
  const [subscriptionStatus, setSubscriptionStatus] = useState('free');
  const [usageData, setUsageData] = useState(() => {
    // Initialize from localStorage immediately
    const saved = localStorage.getItem('usageData');
    return saved ? JSON.parse(saved) : {
      downloadsUsed: 0,
      atsChecksUsed: 0,
      downloadLimit: 3,
      atsLimit: 1
    };
  });
  const [loadingSubscription, setLoadingSubscription] = useState(true);

  // Save usage data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('usageData', JSON.stringify(usageData));
  }, [usageData]);

  const [shareLink, setShareLink] = useState("");
  const [shareError, setShareError] = useState("");
  const [shareLoadingId, setShareLoadingId] = useState(null);

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

  const fileSafe = (s) =>
    (s || 'resume')
      .replace(/[\/\\?%*:|"<>]/g, '-')  // illegal filename chars
      .replace(/\s+/g, ' ')
      .trim();

  const buildFrontendPublicUrl = (token) => `${window.location.origin}/public/resume/${token}`;

  const location = useLocation();
  useEffect(() => {
    if (location.state?.updatedScore) {
      const { id, score } = location.state.updatedScore;
      setLocalScores(prev => ({ ...prev, [id]: score }));
    }
  }, [location.state]);

  // Fetch subscription status and usage data
  const fetchSubscriptionStatus = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || sessionStorage.getItem('token');

      if (!token) {
        setSubscriptionStatus('free');
        setLoadingSubscription(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/payment/subscription-status', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const isPaid = data.hasActiveSubscription;
        const previousStatus = subscriptionStatus;
        setSubscriptionStatus(isPaid ? 'paid' : 'free');

        console.log('Dashboard: Subscription check - Previous:', previousStatus, 'Current:', isPaid ? 'paid' : 'free');

        // Only reset usage if user ACTUALLY just upgraded (was free, now paid)
        // Not just because we're loading the page for the first time
        if (isPaid && previousStatus === 'free' && previousStatus !== null) {
          console.log('Dashboard: User upgraded to pro, resetting usage data');
          const resetUsage = {
            downloadsUsed: 0,
            atsChecksUsed: 0,
            downloadLimit: 3,
            atsLimit: 1
          };
          setUsageData(resetUsage);
          localStorage.setItem('usageData', JSON.stringify(resetUsage));
        } else {
          console.log('Dashboard: Keeping existing usage data');
        }
      } else {
        setSubscriptionStatus('free');
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      setSubscriptionStatus('free');
    } finally {
      setLoadingSubscription(false);
    }
  };

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

        const res = await axios.get('http://localhost:5000/resume/all', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

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
    fetchSubscriptionStatus();
  }, []);

  if (!user) return <p>Loading...</p>;

  // ADD: share handler (does token inline, no helper files)
  const handleShareClick = async (resume) => {
    setResumeName(resume.title || "Untitled Resume");
    setShareError("");
    setShareLink("");
    setShareLoadingId(resume._id);

    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      let url = "";

      // Try POST (create/rotate)
      try {
        const r = await axios.post(`${API_BASE}/resume/${resume._id}/share`, {}, { headers });
        const d = r?.data || {};
        if (d.url) url = d.url;
        else if (d.token) url = buildFrontendPublicUrl(d.token);
      } catch {
        // Fallback: GET existing
        const r = await axios.get(`${API_BASE}/resume/${resume._id}/share`, { headers });
        const d = r?.data || {};
        if (d.url) url = d.url;
        else if (d.token) url = buildFrontendPublicUrl(d.token);
      }

      // Last resort: internal viewer (may require auth)
      if (!url) url = `${window.location.origin}/resumeview/${resume._id}?public=1`;

      setShareLink(url);
      setIsShareModalOpen(true);
    } catch (e) {
      console.error("Share link error", e);
      setShareError("Could not generate a shareable link. Please try again.");
      setIsShareModalOpen(true);
    } finally {
      setShareLoadingId(null);
    }
  };


  /*const handleDownloadClick = (resume) => {
    setResumeName(resume.name);
    setDownloadLink(`https://myresume.com/${resume.name}_Resume.pdf`);

    setIsDownloadModalOpen(true);
  };*/

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  const fmt = (d) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '—');

  const handleDownloadClick = async (resume) => {
    // Check limits for free users
    if (subscriptionStatus === 'free' && usageData.downloadsUsed >= usageData.downloadLimit) {
      alert(`You've reached your download limit (${usageData.downloadLimit}). Upgrade to Pro for unlimited downloads!`);
      navigate('/subscription');
      return;
    }
    try {
      const token = localStorage.getItem('token') || '';
      const res = await axios.get(`${API_BASE}/download/resume/${resume._id}/pdf`, {
        responseType: 'blob',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const blobUrl = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      setResumeName(resume.title || 'resume');
      setDownloadLink(blobUrl);
      setIsDownloadModalOpen(true);   // <-- show modal now

      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(resume.title || 'resume')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      // Update usage count for free users
      if (subscriptionStatus === 'free') {
        setUsageData(prev => ({
          ...prev,
          downloadsUsed: prev.downloadsUsed + 1
        }));
      }
    } catch (e) {
      alert('Could not download PDF');
    }
  };

  const handleCloseModal = () => {
    setIsShareModalOpen(false);
    setIsDownloadModalOpen(false);

    // clean up the object URL created for download
    if (downloadLink) {
      URL.revokeObjectURL(downloadLink);
      setDownloadLink('');
    }
  };

  const handleATSCheck = (resume) => {
    // Check limits for free users
    if (subscriptionStatus === 'free' && usageData.atsChecksUsed >= usageData.atsLimit) {
      alert(`You've reached your ATS check limit (${usageData.atsLimit}). Upgrade to Pro for unlimited ATS checks!`);
      navigate('/subscription');
      return;
    }

    // Update usage count for free users
    if (subscriptionStatus === 'free') {
      setUsageData(prev => ({
        ...prev,
        atsChecksUsed: prev.atsChecksUsed + 1
      }));
    }

    navigate('/m/atschecker', { state: { resumeId: resume._id } });
  };

  const hasAnyPersonalInfo = (pi = {}) => {
    const keys = [
      'fullName',
      'professionalEmail',
      'phone',
      'address',
      'city',
      'district',
      'country',
      'zipCode',
      'dateOfBirth'
    ];
    return keys.some(k => {
      const v = pi?.[k];
      return v !== undefined && v !== null && String(v).trim() !== '';
    });
  };

  const handleCreateNewResumeClick = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      if (!token) {
        navigate('/profile');
        return;
      }
      const { data } = await axios.get('http://localhost:5000/viewInformation/userInformation', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const rd = data?.defaultResumeData || {};
      const hasPI = hasAnyPersonalInfo(rd.personalInfo);
      const hasEdu = Array.isArray(rd.education) && rd.education.length > 0;
      const hasExp = Array.isArray(rd.experience) && rd.experience.length > 0;

      if (hasPI || hasEdu || hasExp) {
        navigate('/templates');
      } else {
        navigate('/profile');
      }
    } catch (e) {
      console.error('Create New Resume routing check failed:', e);
      navigate('/profile');
    }
  };

  return (
    <div className="resume-fullpage">
      <TopBar />

      {/* Usage Status Bar for Free Users */}
      {!loadingSubscription && subscriptionStatus === 'free' && (
        <div style={{
          background: 'linear-gradient(135deg, #fff3cd, #ffeaa7)',
          border: '1px solid #ffeaa7',
          padding: '16px 24px',
          margin: '80px 20px 0 20px',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#856404', fontWeight: 600, marginBottom: '4px' }}>DOWNLOADS</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#856404' }}>
                {usageData.downloadsUsed}/{usageData.downloadLimit}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#856404', fontWeight: 600, marginBottom: '4px' }}>ATS CHECKS</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#856404' }}>
                {usageData.atsChecksUsed}/{usageData.atsLimit}
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/subscription')}
            style={{
              background: '#6c7a3a',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Upgrade to Pro
          </button>
        </div>
      )}

      <div className="resume-header" style={{ marginTop: subscriptionStatus === 'free' ? '20px' : '80px' }}>
        <h2>My Resumes</h2>
        <div className="header-actions">
          {/* CHANGED: conditional navigation instead of plain Link */}
          <button type="button" className="create-btn" onClick={handleCreateNewResumeClick}>
            Create New Resume
          </button>
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

        {!loadingResumes && !resumeError && resumes.map((r) => {
          const canDownload = subscriptionStatus === 'paid' || usageData.downloadsUsed < usageData.downloadLimit;
          const canUseATS = subscriptionStatus === 'paid' || usageData.atsChecksUsed < usageData.atsLimit;

          return (
            <div className="resume-table-row" key={r._id}>
              <button
                className="resume-name-link"
                onClick={() => navigate(`/resumeview/${r._id}`)}
                title="Open resume"
              >
                {r.title || 'Untitled'}
              </button>

              <span>{fmt(r.updatedAt || r.createdAt)}</span>
              <span>{fmt(r.createdAt)}</span>

              <span className="strength-badge">
                {Number.isFinite(Number(r?.strength)) ? Number(r.strength) : '—'}
              </span>

              <span className="actions">
                <button
                  onClick={() => handleDownloadClick(r)}
                  disabled={!canDownload}
                  style={{
                    opacity: canDownload ? 1 : 0.5,
                    cursor: canDownload ? 'pointer' : 'not-allowed',
                    backgroundColor: canDownload ? '' : '#e9ecef'
                  }}
                  title={!canDownload ? `Download limit reached (${usageData.downloadsUsed}/${usageData.downloadLimit})` : ''}
                >
                  {subscriptionStatus === 'paid' ? 'Download ' : `Download (${usageData.downloadLimit - usageData.downloadsUsed} left)`}
                </button>

                <button onClick={() => handleShareClick(r)}>Link</button>

                <button
                  onClick={() => handleATSCheck(r)}
                  disabled={!canUseATS}
                  style={{
                    opacity: canUseATS ? 1 : 0.5,
                    cursor: canUseATS ? 'pointer' : 'not-allowed',
                    backgroundColor: canUseATS ? '' : '#e9ecef'
                  }}
                  title={!canUseATS ? `ATS check limit reached (${usageData.atsChecksUsed}/${usageData.atsLimit})` : ''}
                >
                  {subscriptionStatus === 'paid' ? 'ATS Check ' : `ATS Check (${usageData.atsLimit - usageData.atsChecksUsed} left)`}
                </button>
              </span>
            </div>
          );
        })}
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
                <div key={index} className="info-subbox">
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
                <div key={index} className="info-subbox">
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
                <div key={index} className="info-subbox">
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
                <div key={index} className="info-subbox">
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
                <div key={index} className="info-subbox">
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
                <div key={index} className="info-subbox">
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
                <div key={index} className="info-subbox">
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
        resumeLink={shareLink}       // ADD
        resumeName={resumeName}      // ADD (you already have this state)
        error={shareError}           // ADD
      />
      <DownloadResumeModal
        isOpen={isDownloadModalOpen}
        onClose={handleCloseModal}
        resumeName={resumeName}
        downloadLink={downloadLink}
        downloadFileName={`${fileSafe(resumeName)}.pdf`}   // filename from title
      />
    </div>
  );
};

export default Dashboard;