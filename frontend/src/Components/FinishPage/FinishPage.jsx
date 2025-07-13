import React from 'react';
import './FinishPage.css';

const FinishPage = () => {
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
            <div className="primary-btn" role="button" tabIndex="0">
              Go to Homepage
            </div>
          </div>

          {/* Additional Info */}
          <div className="additional-info">
            <p>
              <strong>Remember:</strong> You can cancel your subscription at any time from your account settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinishPage;