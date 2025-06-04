import React from 'react';

const TopBar = () => (
  <div className="top-bar">
    <div className="top-bar-title">
      <h2>Resumix</h2>
    </div>
    <div className="top-bar-buttons">
      <button>
        <img src="./icons8-home-48.png" alt="Home" width="30" height="30" />
        <span>Home</span>
      </button>
      <button>
        <img src="./icons8-test-account-48.png" alt="Account" width="30" height="30" />
        <span>Account</span>
      </button>
    </div>
  </div>
);

export default TopBar;