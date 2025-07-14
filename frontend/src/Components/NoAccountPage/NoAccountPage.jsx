import React from 'react';
import './NoAccountPage.css';

const NoAccountPage = ({ handleClose }) => {
  return (
    <div className="no-account-container">
      <div className="no-account-card">
        <button className="close-btn" onClick={handleClose}>×</button>
        <img src="/error.png" alt="No Account" className="no-account-image" />
        <h2>You have not created any account!</h2>
        <p>You need to log in if you have an account.</p>
      </div>
    </div>
  );
};

export default NoAccountPage;



