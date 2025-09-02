import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NoAccountPage.css';

const NoAccountPage = ({ handleClose }) => {
  const navigate = useNavigate();

  const handleCloseClick = () => {
    // Call the original handleClose if provided
    if (handleClose) {
      handleClose();
    }
    // Navigate to home page
    navigate('/');
  };

  return (
    <div className="no-account-container">
      <div className="no-account-card">
        <button className="close-btn" onClick={handleCloseClick}>×</button>
        <img src="/error.png" alt="No Account" className="no-account-image" />
        <h2>You have not created any account!</h2>
        <p>You need to log in if you have an account.</p>
      </div>
    </div>
  );
};

export default NoAccountPage;