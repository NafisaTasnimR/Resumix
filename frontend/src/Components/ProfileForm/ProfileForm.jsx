import React, { useState } from 'react';
import './ProfileForm.css';

const ProfileForm = () => {
  const [showAddressDetails, setShowAddressDetails] = useState(false);

  const handleAddressClick = () => {
    setShowAddressDetails(true);
  };

  return (
    <div className="resume-container">
      <div className="resume-header">
        <h1>RESUMIX</h1>
        <div className="header-line"></div>
      </div>

      <div className="content-wrapper">
        <div className="left-section">
          <div className="photo-placeholder"></div>
        </div>

        <div className="right-section">
          <div className="personal-info-header">
            <h2>Personal Information</h2>
            <div className="info-line"></div>
          </div>

          <div className="form-fields">
            <div className="field-group">
              <label>Name:</label>
              <input type="text" className="input-field" />
            </div>

            <div className="field-group">
              <label>Email:</label>
              <input type="email" className="input-field" />
            </div>

            <div className="field-group">
              <label>Date of Birth:</label>
              <input type="date" className="input-field" />
            </div>

            <div className="field-group">
              <label>Phone:</label>
              <input type="tel" className="input-field" />
            </div>

            <div className="field-group">
              <label>Address:</label>
              <input 
                type="text" 
                className={`input-field ${showAddressDetails ? 'expanded' : ''}`}
                onClick={handleAddressClick}
                placeholder="Click to expand address details"
                readOnly={!showAddressDetails}
              />
            </div>

            {showAddressDetails && (
              <div className="address-details">
                <div className="field-group">
                  <label>City:</label>
                  <input type="text" className="input-field city-field" />
                </div>

                <div className="field-row">
                  <div className="field-group half-width">
                    <label>District:</label>
                    <input type="text" className="input-field" />
                  </div>
                  <div className="field-group half-width">
                    <label>Country:</label>
                    <input type="text" className="input-field" />
                  </div>
                </div>

                <div className="field-group">
                  <label>Zip Code:</label>
                  <input type="text" className="input-field" />
                </div>

                <div className="field-group">
                  <label>Country:</label>
                  <input type="text" className="input-field" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="navigation">
        <button className="nav-button">
          <span className="arrow">→</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileForm;