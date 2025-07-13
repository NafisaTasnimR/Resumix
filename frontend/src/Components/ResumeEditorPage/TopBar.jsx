import React from 'react';
import home from '../../assets/icons8-home-48.png'
import account from '../../assets/icons8-account-48.png'


const TopBar = () => (
  <div className="top-bar">
    <div className="top-bar-title">
      <h2>Resumix</h2>
    </div>
    <div className="top-bar-buttons">
      <button>
        <img src={home} alt="Home" width="30" height="30" />
        <span>Home</span>
      </button>
      <button>
        <img src={account} alt="Account" width="30" height="30" />
        <span>Account</span>
      </button>
    </div>
  </div>
);

export default TopBar;