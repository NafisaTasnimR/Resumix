import './PostLoginHeader.css';
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PostLoginHeader = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState('free'); // 'free' or 'paid'
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch subscription status on component mount
  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || sessionStorage.getItem('token');
      console.log(' Token found:', token ? 'Yes' : 'No');
      
      if (!token) {
        console.log(' No token found, setting to free');
        setSubscriptionStatus('free');
        setLoading(false);
        return;
      }

      console.log(' Fetching subscription status...');
      const response = await fetch('http://localhost:5000/api/payment/subscription-status', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(' Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log(' Subscription data:', data);
        setSubscriptionStatus(data.hasActiveSubscription ? 'paid' : 'free');
        console.log(' Badge will show:', data.hasActiveSubscription ? 'PRO' : 'FREE');
      } else {
        console.log(' Response not ok, setting to free');
        setSubscriptionStatus('free');
      }
    } catch (error) {
      console.error(' Error fetching subscription status:', error);
      setSubscriptionStatus('free');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const hasAnyPersonalInfo = (pi = {}) => {
    const keysToCheck = [
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
    return keysToCheck.some(k => {
      const v = pi?.[k];
      return v !== undefined && v !== null && String(v).trim() !== '';
    });
  };

  const handleBuildClick = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      if (!token) {
        navigate('/profile');
        return;
      }

      const { data } = await axios.get('http://localhost:5000/info/userInformation', {
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
    } catch (err) {
      console.error('Failed to check user information:', err);
      navigate('/profile');
    }
  };

  return (
    <>
      <header className="postlogin-header">
        <nav className="navbar">
          <div className="header-left logo">
            <div className="logo-with-badge">
              RESUMIX
              {!loading && (
                <span className={`subscription-badge ${subscriptionStatus === 'paid' ? 'pro' : 'free'}`}>
                  {subscriptionStatus === 'paid' ? 'PRO' : 'FREE'}
                </span>
              )}
            </div>
          </div>

          <div className="nav-center">
            <Link to="/resumes">Resumes</Link>
            <Link to="/templates">Templates</Link>
            <Link to="/subscription">Subscription</Link>
          </div>
          <div className="nav-right">
            <div className="user-dropdown" ref={dropdownRef}>
              <div className="user-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <span className="user-avatar">
                </span>
                <button className="account-button">
                  MY ACCOUNT
                  <span className="dropdown-arrow">▾</span>
                </button>
              </div>
              {dropdownOpen && (
                <div className="dropdown-content">
                  <Link to="/dashboard">
                    <img src="/layout.png" alt="Dashboard" className="dropdown-icon" />
                    Dashboard
                  </Link>
                  <Link to="/settings">
                    <img src="/pro.png" alt="Settings" className="dropdown-icon" />
                    Account
                  </Link>
                  <Link to="/">
                    <img src="/exit.png" alt="Sign Out" className="dropdown-icon" />
                    Sign Out
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-preview">
        <div className="image-container">
          {/* Floating 3-card templates (no CSS file edits; styles are scoped here) */}
          <style>{`
  .hero-floating { 
    position: relative; 
    width: min(35vw, 530px);   /* was 38vw/560px */
    height: min(35vw, 530px);  /* was 38vw/560px */
    pointer-events: none; 
    margin-top: -70px
  }
  .hero-floating .tpl { position: absolute; animation: heroDrift 12s ease-in-out infinite; }
  .hero-floating .card { background: #fff; border-radius: 8px; padding: 10px; box-shadow: 0 20px 60px rgba(0,0,0,.18); }
  .hero-floating img { display: block; width: 100%; height: auto; border-radius: 10px; }

  /* reduced individual card widths */
  .hero-floating .tpl-1 { top: 8%; left: -10%;    width: 59%; } /* was 62% */
  .hero-floating .tpl-2 { top: 25%; left: 32%;  width: 63%; animation-duration: 13s; animation-delay: -0.6s; } /* was 66% */
  .hero-floating .tpl-3 { top: 45%; left: -2%;  width: 59%; animation-duration: 15s; animation-delay: -1s; }  /* was 58% */

  /* keep the slight rotations */
  .hero-floating .tpl-1 .card { transform: rotate(-7.9deg); }
  .hero-floating .tpl-2 .card { transform: rotate( 7.2deg); }
  .hero-floating .tpl-3 .card { transform: rotate(-2.5deg); }

  @keyframes heroDrift { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-18px) } }

  @media (max-width: 900px){
    .hero-floating { width: 80vw; height: 80vw; } /* slightly smaller on mobile too */
  }
`}</style>


          <div className="hero-floating">
            <div className="tpl tpl-1">
              <div className="card">
                {/* <<< replace src with your first template image >>> */}
                <img src="/tem3.png" alt="Template 1" loading="lazy" />
              </div>
            </div>
            <div className="tpl tpl-2">
              <div className="card">
                {/* <<< replace src with your second template image >>> */}
                <img src="/tem2.png" alt="Template 2" loading="lazy" />
              </div>
            </div>
            <div className="tpl tpl-3">
              <div className="card">
                {/* <<< replace src with your third template image >>> */}
                <img src="/tem1.png" alt="Template 3" loading="lazy" />
              </div>
            </div>
          </div>
        </div>

        <div className="content-container">
          <h1>Create a Job-Ready Resume in Few Minutes</h1>
          <p className="subtext">Create your resume with our free builder and professional templates</p>

          <button onClick={handleBuildClick} className="primary-btn">Build Your Resume</button>

          {/* Live Preview Section */}
          <h1>Quick, Easy And Flexible Editing With Live Preview</h1>
          <p className="subtext">
            Choose font types, sizes, and spacing. You can bold, underline, and italicize your text
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="steps">
        <h2 className="steps-title">Create a Perfect Resume in 4 Easy Steps:</h2>
        <div className="step-boxes-visual">
          <div className="step-card">
            <img src="/file.png" alt="Pick a Template" />
            <div className="step-label">STEP 1</div>
            <h3>Choose a Free Template</h3>
            <p>Choose from templates crafted by us to help you land the interview.</p>
          </div>

          <div className="step-card">
            <img src="/applicant.png" alt="Add Expert Content" />
            <div className="step-label">STEP 2</div>
            <h3>Fill in Your Details</h3>
            <p>With just a few clicks update your information.</p>
          </div>

          <div className="step-card">
            <img src="/resume.png" alt="Make it Yours" />
            <div className="step-label">STEP 3</div>
            <h3>Customize Your Resume</h3>
            <p>Adjust the colors, fonts, and layout with user-friendly interface.</p>
          </div>

          <div className="step-card">
            <img src="/download1.png" alt="Download" />
            <div className="step-label">STEP 4</div>
            <h3>Share as PDF or Web</h3>
            <p>Download your polished resume in the preferred file format.</p>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="template-features">
        <div className="template-header">
          <h2 className="section-title">Make Your Resume With Proven And Professional Templates</h2>
          <p className="section-description">
            Use one of our field-tested resume templates, designed by experts and typographers.
          </p>
        </div>

        <div className="feature-row">
          <div className="feature">
            <img src="/checked.png" alt="ATS" />
            <div>
              <h3>ATS-Friendly</h3>
              <p>Tick every box and make sure your resume is never filtered out by the hiring software.</p>
            </div>
          </div>
          <div className="feature">
            <img src="/badge.png" alt="Professional" />
            <div>
              <h3>Professional</h3>
              <p>Formal layouts ideal for corporate jobs. Clean typography makes a big impact.</p>
            </div>
          </div>
        </div>

        <div className="feature-row">
          <div className="feature">
            <img src="/technology.png" alt="Modern" />
            <div>
              <h3>Modern</h3>
              <p>Sleek and minimalist designs that feel current and stylish.</p>
            </div>
          </div>
          <div className="feature">
            <img src="/idea.png" alt="Creative" />
            <div>
              <h3>Creative</h3>
              <p>For roles that value uniqueness. Bold designs that let you stand out.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PostLoginHeader;