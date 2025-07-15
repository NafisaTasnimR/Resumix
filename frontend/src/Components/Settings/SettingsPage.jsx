import React, { useState, useEffect } from 'react';
import './SettingsPage.css';
import { Link } from 'react-router-dom';
import TopBar from '../ResumeEditorPage/TopBar';
const SettingsPage = () => {
  const [password, setPassword] = useState('*******');
  const [modalType, setModalType] = useState(null); 
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [prevPassword, setPrevPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  const evaluatePasswordStrength = (password) => {
    if (password.length < 6) return 'weak';
    if (password.match(/[A-Z]/) && password.match(/[0-9]/) && password.length >= 8) return 'strong';
    return 'medium';
  };

  useEffect(() => {
    if (confirmPassword && newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  }, [newPassword, confirmPassword]);

  const savePassword = () => {
    const actualCurrentPassword = '*******';

    if (prevPassword !== actualCurrentPassword) {
      setPasswordError('Previous password is incorrect');
    } else if (newPassword === confirmPassword && newPassword.length > 0) {
      setPassword('*******');
      setPasswordError('');
    } else {
      setPasswordError('Passwords do not match');
    }
  };

  return (
    <div className="settings-container">
      <TopBar/>
      <div className="settings-card">
        <h2 className="settings-title">General Account Settings</h2>

        <div className="settings-row">
          <span className="label">Account ID:</span>
          <span className="value">22*******</span>
        </div>

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
            <h2>Password</h2>
            <p className="modal-label">CHANGE YOUR PASSWORD</p>

            <input
              type="password"
              className="modal-input"
              placeholder="Enter current password"
              value={prevPassword}
              onChange={(e) => setPrevPassword(e.target.value)}
            />

            <input
              type="password"
              className="modal-input"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => {
                const value = e.target.value;
                setNewPassword(value);
                setPasswordStrength(evaluatePasswordStrength(value));
              }}
            />
            {newPassword && (
              <p className={`password-strength ${passwordStrength.toLowerCase()}`}>
                Password strength is {passwordStrength}
              </p>
            )}

            <input
              type="password"
              className="modal-input"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {passwordError && <p className="password-error">{passwordError}</p>}

            <button className="modal-save-btn" onClick={savePassword}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;