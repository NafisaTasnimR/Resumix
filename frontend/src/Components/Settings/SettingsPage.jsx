import React, { useState } from 'react';
import './SettingsPage.css';

const SettingsPage = () => {
  const [email, setEmail] = useState('*****@gmail.com');
  const [password, setPassword] = useState('*******');

  const [modalType, setModalType] = useState(null); 
  const [tempEmail, setTempEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const openModal = (type) => {
    setModalType(type);
    if (type === 'email') setTempEmail(email);
  };

  const closeModal = () => {
    setModalType(null);
    setTempEmail('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
  };

  const saveEmail = () => {
    setEmail(tempEmail);
    closeModal();
  };

  const savePassword = () => {
    if (newPassword === confirmPassword && newPassword.length > 0) {
      setPassword('*******');
      setPasswordError('');
      closeModal();
    } else {
      setPasswordError('Passwords do not match');
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-card">
        <h2 className="settings-title">General Account Settings</h2>

        <div className="settings-row">
          <span className="label">Account ID:</span>
          <span className="value">22*******</span>
          <div style={{ width: '50px' }}></div>
        </div>

        <div className="settings-row">
          <span className="label">Email ID:</span>
          <span className="value">{email}</span>
          <button className="edit-btn" onClick={() => openModal('email')}>
            <span className="edit-icon">✏️</span> <span className="edit-text">edit</span>
          </button>
        </div>

        <div className="settings-row">
          <span className="label">Password:</span>
          <span className="value">{password}</span>
          <button className="edit-btn" onClick={() => openModal('password')}>
            <span className="edit-icon">✏️</span> <span className="edit-text">edit</span>
          </button>
        </div>
      </div>

      {/* Email Modal */}
      {modalType === 'email' && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={closeModal}>×</button>
            <h2>Account Email</h2>
            <p className="modal-label">EDIT YOUR ACCOUNT EMAIL ADDRESS</p>
            <input
              type="email"
              className="modal-input"
              value={tempEmail}
              onChange={(e) => setTempEmail(e.target.value)}
            />
            <button className="modal-save-btn" onClick={saveEmail}>Save</button>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {modalType === 'password' && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={closeModal}>×</button>
            <h2>Password</h2>
            <p className="modal-label">CHANGE YOUR PASSWORD</p>
            <input
              type="password"
              className="modal-input"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
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
