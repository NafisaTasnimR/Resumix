import React, { useEffect, useState } from 'react';
import './SettingsPage.css';
import TopBar from '../ResumeEditorPage/TopBar';
import axios from 'axios';

// Decode JWT to fall back to account email if backend omits it
function decodeJwt(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return {};
  }
}

const SettingsPage = () => {
  const [profile, setProfile] = useState({ username: '', email: '', userType: 'free' });
  const [subscriptionStatus, setSubscriptionStatus] = useState('free');
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // Fetch subscription status
  const fetchSubscriptionStatus = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || sessionStorage.getItem('token');
      
      if (!token) {
        setSubscriptionStatus('free');
        return;
      }

      const response = await fetch('http://localhost:5000/api/payment/subscription-status', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubscriptionStatus(data.hasActiveSubscription ? 'paid' : 'free');
        setSubscriptionData(data);
      } else {
        setSubscriptionStatus('free');
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      setSubscriptionStatus('free');
    }
  };

  useEffect(() => {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    const tokenEmail = token ? decodeJwt(token)?.email : '';

    const loadUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/info/userInformation', {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const u = res.data?.user || res.data?.data || res.data || {};
        setProfile({
          username: u?.username || '',
          // account email only (signup/login email)
          email: u?.email || tokenEmail || '',
          userType: u?.userType || 'free',
        });

        // Fetch actual subscription status
        await fetchSubscriptionStatus();
      } catch (e) {
        setErr(e.response?.data?.message || e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const pretty = (v) => (v ? String(v).toUpperCase() : '—');

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="settings-container">
      <TopBar />
      <div className="settings-card">
        <h2 className="settings-title">Your Profile</h2>

        {loading ? (
          <div className="settings-row">
            <span className="label">Loading…</span>
          </div>
        ) : err ? (
          <div className="settings-row">
            <span className="label">ERROR</span>
            <span className="value">{err}</span>
          </div>
        ) : (
          <>
            <div className="settings-row">
              <span className="label">USERNAME:</span>
              <span className="value">{profile.username || '—'}</span>
            </div>

            <div className="settings-row">
              <span className="label">EMAIL ID:</span>
              <span className="value">{profile.email || '—'}</span>
            </div>

            <div className="settings-row">
              <span className="label">SUBSCRIPTION:</span>
              <span className="value">
                {subscriptionStatus === 'paid' ? 'PRO' : 'FREE'}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;