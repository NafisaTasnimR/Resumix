import React, { useState } from 'react';
import './LandingPage.css';
import { Link } from 'react-router-dom';
import NoAccountPage from '../NoAccountPage/NoAccountPage';

const LandingPage = () => {
  const [showPopup, setShowPopup] = useState(false);

  const openPopup = () => setShowPopup(true);
  const closePopup = () => setShowPopup(false);

  return (
    <div className="landing-container">
      {showPopup && <NoAccountPage handleClose={closePopup} />}

      {/* Header */}
      <header className="header">
        <div className="header-left logo">RESUMIX</div>

        <div className="header-center1">
          
           <Link to="/publictemplates" className="nav-item1 active1">Templates</Link>
          <span className="nav-item1" onClick={openPopup} style={{ cursor: 'pointer' }}>Subscription</span>
        </div>


        <div className="auth-buttons">
          <Link to="/login" className="login-btn">Login</Link>
          <Link to="/signup" className="register-btn">Signup</Link>
        </div>
      </header>

      <section className="hero-preview">
        <div className="image-container">
            {/* Floating 3-card templates (no CSS file edits; styles are scoped here) */}
          <style>{`
  .hero-floating { 
    position: relative; 
    width: min(35vw, 530px);  
    height: min(35vw, 530px); 
    pointer-events: none; 
    margin-top: -70px
  }
  .hero-floating .tpl { position: absolute; animation: heroDrift 4s ease-in-out infinite; }
  .hero-floating .card { background: #fff; border-radius: 8px; padding: 10px; box-shadow: 0 20px 60px rgba(0,0,0,.18); }
  .hero-floating img { display: block; width: 100%; height: auto; border-radius: 10px; }

  /* reduced individual card widths */
  .hero-floating .tpl-1 { top: 8%; left: -4%;    width: 59%; } 
  .hero-floating .tpl-2 { top: 25%; left: 40%;  width: 63%; animation-duration: 5s; animation-delay: -0.6s; } 
  .hero-floating .tpl-3 { top: 45%; left: 8%;  width: 59%; animation-duration: 4s; animation-delay: -1s; } 

  /* keep the slight rotations */
  .hero-floating .tpl-1 .card { transform: rotate(-12deg); }
  .hero-floating .tpl-2 .card { transform: rotate( 7.2deg); }
  .hero-floating .tpl-3 .card { transform: rotate(-2.5deg); }

  @keyframes heroDrift { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-18px) } }

  @media (max-width: 900px){
    .hero-floating { width: 80vw; height: 80vw; } 
  }
`}</style>


          <div className="hero-floating">
            <div className="tpl tpl-1">
              <div className="card">
                <img src="/tem3.png" alt="Template 1" loading="lazy" />
              </div>
            </div>
            <div className="tpl tpl-2">
              <div className="card">
                <img src="/tem2.png" alt="Template 2" loading="lazy" />
              </div>
            </div>
            <div className="tpl tpl-3">
              <div className="card">
                <img src="/tem1.png" alt="Template 3" loading="lazy" />
              </div>
            </div>
          </div>
        </div>

        <div className="content-container">
          <h1>Create a Job-Ready Resume in Few Minutes</h1>
          <p className="subtext">Create your resume with our free builder and professional templates</p>
          <span onClick={openPopup} className="primary-btn" style={{ cursor: 'pointer' }}>Build Your Resume</span>
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
    </div>
  );
};

export default LandingPage;
