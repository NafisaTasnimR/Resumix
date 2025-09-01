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
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

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
      } catch (e) {
        setErr(e.response?.data?.message || e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const pretty = (v) => (v ? String(v).toUpperCase() : '—');

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
              <span className="value">{pretty(profile.userType)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
