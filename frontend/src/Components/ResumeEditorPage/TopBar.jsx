import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import home from '../../assets/icons8-home-48.png'; // keep your original Home icon

const TopBar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState('free'); // 'free' or 'paid'
  const [loading, setLoading] = useState(true);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);

  // Fetch subscription status on component mount
  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || sessionStorage.getItem('token');
      console.log(' TopBar - Token found:', token ? 'Yes' : 'No');
      
      if (!token) {
        console.log(' TopBar - No token found, setting to free');
        setSubscriptionStatus('free');
        setLoading(false);
        return;
      }

      console.log(' TopBar - Fetching subscription status...');
      const response = await fetch('http://localhost:5000/api/payment/subscription-status', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(' TopBar - Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log(' TopBar - Subscription data:', data);
        setSubscriptionStatus(data.hasActiveSubscription ? 'paid' : 'free');
        console.log(' TopBar - Badge will show:', data.hasActiveSubscription ? 'PRO' : 'FREE');
      } else {
        console.log(' TopBar - Response not ok, setting to free');
        setSubscriptionStatus('free');
      }
    } catch (error) {
      console.error(' TopBar - Error fetching subscription status:', error);
      setSubscriptionStatus('free');
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleHomeClick = () => { navigate('/postlogin/'); };
  const handleDashboardClick = () => { navigate('/dashboard'); };
  const handleResumeClick = () => { navigate('/resumes'); };
  const handleSegmentsClick = () => { navigate('/templates'); };
  const handleAccountClick = () => { navigate('/subscription'); };
  const handleSettingsClick = () => { navigate('/settings'); };

  useEffect(() => {
    const onDocMouseDown = (e) => {
      // If click is inside menu, do nothing
      if (menuRef.current && menuRef.current.contains(e.target)) return;
      // If click is on the hamburger button, let its own onClick handle toggle
      if (hamburgerRef.current && hamburgerRef.current.contains(e.target)) return;
      setOpen(false);
    };
    if (open) document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [open]);

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-title">
          {/* Hamburger icon (left of RESUMIX) — replace src path as needed */}
          <button
            ref={hamburgerRef}
            aria-label="Open navigation"
            className="hamburger-btn"
            onClick={() => setOpen(v => !v)}
          >
            <img className="hamburger-img" src="/menu.png" alt="Menu" />
          </button>
          <div className="logo-with-badge">
            <h2>RESUMIX</h2>
            {!loading && (
              <span className={`subscription-badge ${subscriptionStatus === 'paid' ? 'pro' : 'free'}`}>
                {subscriptionStatus === 'paid' ? 'PRO' : 'FREE'}
              </span>
            )}
          </div>
        </div>

        {/* RIGHT: keep Home exactly as in your initial file */}
        <div className="top-bar-buttons">
          <button onClick={handleHomeClick}>
            <img src={home} alt="Home" width="30" height="30" />
            <span>Home</span>
          </button>
          {/* Dashboard button removed as requested */}
        </div>
      </div>

      {/* Dropdown menu */}
      <div
        ref={menuRef}
        className={`nav-menu ${open ? 'open' : ''}`}
        role="menu"
        aria-hidden={!open}
      >
        <button className="nav-item" onClick={handleDashboardClick} role="menuitem">
          <img className="nav-item-icon" src="/layout.png" alt="Home" />
          <span>Dashboard</span>
        </button>

        <button className="nav-item" onClick={handleResumeClick} role="menuitem">
          <img className="nav-item-icon" src="/navr.png" alt="Resume" />
          <span>Resumes</span>
        </button>

        <button className="nav-item" onClick={handleSegmentsClick} role="menuitem">
          <img className="nav-item-icon" src="/stack.png" alt="Segments" />
          <span>Templates</span>
        </button>

        <button className="nav-item" onClick={handleAccountClick} role="menuitem">
          <img className="nav-item-icon" src="/subscription.png" alt="Account" />
          <span>Subscription</span>
        </button>

        <button className="nav-item" onClick={handleSettingsClick} role="menuitem">
          <img className="nav-item-icon" src="/setting.png" alt="Settings" />
          <span>Settings</span>
        </button>
      </div>
    </>
  );
};

export default TopBar;