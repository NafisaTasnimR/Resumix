import './PostLoginHeader.css';
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import userIcon from '../../assets/icons8-account-48.png';

const PostLoginHeader = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  return (
    <>
      <header className="postlogin-header">
        <nav className="navbar">
          <div className="header-left logo">RESUMIX</div>

          <div className="nav-center">
            <Link to="/resumes">Resumes</Link>
            <Link to="/templates">Templates</Link>
            <Link to="/subscription">Subscription</Link>
          </div>
          <div className="nav-right">
            <div className="user-dropdown" ref={dropdownRef}>
              <div className="user-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <span className="user-avatar">
                  <img src={userIcon} alt="Account Icon" className="account-icon" />
                </span>
                <button className="account-button">
                  MY ACCOUNT 
                  <span className="dropdown-arrow">▾</span>
                </button>
              </div>
              {dropdownOpen && (
                <div className="dropdown-content">
                  <Link to="/dashboard">
                    <span role="img" aria-label="dashboard">👤</span> Dashboard
                  </Link>
                  <Link to="/settings">
                    <span role="img" aria-label="settings">⚙️</span> Settings
                  </Link>
                  <Link to="/">
                    <span role="img" aria-label="signout">↩️</span> Sign Out
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
          <img src="/bg.jpg" alt="Hero Background" />
        </div>
        <div className="content-container">
          <h1>Create a Job-Ready Resume in Few Minutes</h1>
          <p className="subtext">Create your resume with our free builder and professional templates</p>
          <Link to="/profile" className="primary-btn">Build Your Resume</Link>

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
            <p>Choose from templates crafted by career professionals to help you land the interview.</p>
          </div>

          <div className="step-card">
            <img src="/applicant.png" alt="Add Expert Content" />
            <div className="step-label">STEP 2</div>
            <h3>Fill in Your Details</h3>
            <p>With just a few clicks, add tailored, job-specific contents.</p>
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
