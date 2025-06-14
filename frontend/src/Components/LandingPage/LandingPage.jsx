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
        
        <div className="step-boxes">
          <div className="step">1. <p>Choose a Free Resume Template</p></div>
          <div className="step">2. <p>Fill in Your Details</p></div>
          <div className="step">3. <p>Customize Your Resume</p></div>
          <div className="step">4. <p>Share as PDF or Web</p></div>
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
