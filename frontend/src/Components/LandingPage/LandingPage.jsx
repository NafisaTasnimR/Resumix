import React from 'react';
import './LandingPage.css';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Header */}
      <header className="header">
  <div className="header-left logo">RESUMIX</div>

  <div className="header-center">
    <ul>
      <li>Resume</li>
      <li>Resources</li>
      <li>Premium Services</li>
    </ul>
  </div>

  <div className="auth-buttons">
    <Link to="/login" className="login-btn">Login</Link>
    <Link to="/signup" className="register-btn">Signup</Link>
  </div>
</header>


      {/* Hero Section */}
      <section className="hero">
        <h1>Create a Job-Ready Resume in Few Minutes.</h1>
        <p className="subtext">Create your resume with our free builder and professional templates.</p>
        <button className="primary-btn">Build Your Resume</button>
      </section>


      {/* Live Preview */}
      <section className="preview">
        <h1>Quick, Easy And Flexible Editing With Live Preview</h1>
        <p className="subtext">
        Choose font types, sizes, and spacing. You can bold, underline, and italicize your text.
        </p>
      </section>


      {/* Steps Section */}
      <section className="steps">
        <h2 className="steps-title">Create a Perfect Resume in 4 easy steps:</h2>
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
      <section className="templates">
        <h4>OPTIMIZED DESIGNS</h4>
        <h2>Make Your Resume With Proven And Professional Templates</h2>
        <p>Use one of our field-tested resume templates, designed by experts and typographers.</p>
        <div className="features">
          <span> ATS-Friendly</span>
          <span> Professional</span>
          <span> Modern</span>
          <span> Creative</span>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
