import React from 'react';
import { useNavigate } from 'react-router-dom';
import home from '../../assets/icons8-home-48.png'
import account from '../../assets/icons8-account-48.png'

const TopBar = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/postlogin/'); 
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className="top-bar">
      <div className="top-bar-title">
        <h2>RESUMIX</h2>
      </div>
      <div className="top-bar-buttons">
        <button onClick={handleHomeClick}>
          <img src={home} alt="Home" width="30" height="30" />
          <span>Home</span>
        </button>
        <button onClick={handleDashboardClick}>
          <img src={account} alt="Dashboard" width="30" height="30" />
          <span>Dashboard</span>
        </button>
      </div>
    </div>
  );
};

export default TopBar;