import React from 'react';
import './FinishPage.css';
// *** ADDED: Import useNavigate for navigation ***
import { useNavigate } from 'react-router-dom';

const FinishPage = () => {
  // *** ADDED: Initialize navigation hook ***
  const navigate = useNavigate();

  // *** ADDED: Function to handle home page navigation ***
  const handleGoToHome = () => {
    // Navigate to the post login page
    navigate('/postlogin/');
  };

  return (
    <div className="finish-container">
      {/* Progress Steps */}
      <div className="progress-steps">
        <div className="step completed">
          <div className="step-icon">✓</div>
          <span>Home Page</span>
        </div>
        <div className="step completed">
          <div className="step-icon">✓</div>
          <span>Choose Access</span>
        </div>
        <div className="step completed">
          <div className="step-icon">✓</div>
          <span>Payment Details</span>
        </div>
        <div className="step active">
          <div className="step-number">4</div>
          <span>Finished!</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="success-section">
          {/* Success Icon */}
          <div className="success-icon">
            <div className="checkmark-circle">
              <div className="checkmark">✓</div>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="success-title">Subscription Complete!</h1>
          <p className="success-subtitle">
            Welcome to your premium experience. You're all set to start creating amazing resumes!
          </p>

          {/* Confirmation Details */}
          <div className="confirmation-card">
            <h3 className="confirmation-title">What happens next?</h3>
            <div className="confirmation-items">
              <div className="confirmation-item">
                <div className="item-icon">📧</div>
                <div className="item-content">
                  <h4>Confirmation Email</h4>
                  <p>You'll receive a confirmation email with your subscription details within the next few minutes.</p>
                </div>
              </div>
              <div className="confirmation-item">
                <div className="item-icon">🚀</div>
                <div className="item-content">
                  <h4>Start Creating</h4>
                  <p>Access all premium templates, unlimited downloads, and advanced features immediately.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            {/* *** MODIFIED: Added onClick handler and changed from Link to button *** */}
            <div 
              className="primary-btn" 
              role="button" 
              tabIndex="0"
              onClick={handleGoToHome}
              style={{ cursor: 'pointer' }}
            >
              Go to Home Page
            </div>
          </div>

          {/* Additional Info */}
          <div className="additional-info">
            <p>
              <strong></strong> 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinishPage;