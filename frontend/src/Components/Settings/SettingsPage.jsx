import React, { useState, useEffect } from 'react';
import './SettingsPage.css';

const SettingsPage = () => {
  const [password, setPassword] = useState('*******');
  const [modalType, setModalType] = useState(null);
  const [prevPassword, setPrevPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  const [showPrev, setShowPrev] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const evaluatePasswordStrength = (password) => {
    if (password.length < 6) return 'Weak';
    if (/[A-Z]/.test(password) && /[0-9]/.test(password) && password.length >= 8) return 'Strong';
    return 'Medium';
  };

  useEffect(() => {
    if (confirmPassword && newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  }, [newPassword, confirmPassword]);

  const savePassword = () => {
    const actualCurrentPassword = '*******'; // Example placeholder

    if (prevPassword !== actualCurrentPassword) {
      setPasswordError('Previous password is incorrect');
    } else if (newPassword === confirmPassword && newPassword.length > 0) {
      setPassword('*******');
      setPasswordError('');
      setModalType(null);
      setPrevPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordError('Passwords do not match');
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-card">
        <h2 className="settings-title">General Account Settings</h2>

        <div className="settings-row">
          <span className="label">Username:</span>
          <span className="value">Nishat</span>
        </div>

        <div className="settings-row">
          <span className="label">Email ID:</span>
          <span className="value">*****@gmail.com</span>
        </div>

        <div className="settings-row">
          <span className="label">Password:</span>
          <span className="value">{password}</span>
          <button className="edit-btn2" onClick={() => setModalType('password')}>
            <span className="edit-icon2">✏️</span> <span className="edit-text">edit</span>
          </button>
        </div>
      </div>

      {modalType === 'password' && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={() => setModalType(null)}>×</button>
            <h2>PASSWORD</h2>
            <p className="modal-label">CHANGE YOUR PASSWORD</p>

            {/* Current Password */}
            <div className="settings-password-wrapper">
              <input
                type={showPrev ? 'text' : 'password'}
                className="modal-input"
                placeholder="Enter current password"
                value={prevPassword}
                onChange={(e) => setPrevPassword(e.target.value)}
              />
              <span
                className="settings-eye-icon"
                onClick={() => setShowPrev(!showPrev)}
              >
                <img
                  src={showPrev ? '/view.png' : '/eyebrow.png'}
                  alt={showPrev ? 'Hide password' : 'Show password'}
                  className="settings-eye-img"
                />
              </span>
            </div>

            {/* New Password */}
            <div className="settings-password-wrapper">
              <input
                type={showNew ? 'text' : 'password'}
                className="modal-input"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewPassword(value);
                  setPasswordStrength(evaluatePasswordStrength(value));
                }}
              />
              <span
                className="settings-eye-icon"
                onClick={() => setShowNew(!showNew)}
              >
                <img
                  src={showNew ? '/view.png' : '/eyebrow.png'}
                  alt={showNew ? 'Hide password' : 'Show password'}
                  className="settings-eye-img"
                />
              </span>
            </div>

            <div className="password-checks">
              <span className={/[a-z]/.test(newPassword) ? 'check-active' : 'check-inactive'}>Lower</span>
              <span className={/[A-Z]/.test(newPassword) ? 'check-active' : 'check-inactive'}>Upper</span>
              <span className={/[0-9]/.test(newPassword) ? 'check-active' : 'check-inactive'}>Number</span>
              <span className={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? 'check-active' : 'check-inactive'}>Symbol</span>
            </div>

            {newPassword && (
              <p className={`password-strength ${passwordStrength.toLowerCase()}`}>
                Password strength is {passwordStrength}
              </p>
            )}

            {/* Confirm Password */}
            <div className="settings-password-wrapper">
              <input
                type={showConfirm ? 'text' : 'password'}
                className="modal-input"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                className="settings-eye-icon"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                <img
                  src={showConfirm ? '/view.png' : '/eyebrow.png'}
                  alt={showConfirm ? 'Hide password' : 'Show password'}
                  className="settings-eye-img"
                />
              </span>
            </div>

            {passwordError && <p className="password-error">{passwordError}</p>}

            <button className="modal-save-btn" onClick={savePassword}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
