import React, { useState } from 'react';
import './ProfileForm.css';

const ProfileForm = () => {
  const [currentPage, setCurrentPage] = useState('personal');
  const [showAddressDetails, setShowAddressDetails] = useState(false);

  const handleAddressClick = () => {
    setShowAddressDetails(true);
  };

  const handleNextPage = () => {
    if (currentPage === 'personal') {
      setCurrentPage('experience');
    } else if (currentPage === 'experience') {
      setCurrentPage('education');
    }
  };

  const handlePrevPage = () => {
    if (currentPage === 'experience') {
      setCurrentPage('personal');
    } else if (currentPage === 'education') {
      setCurrentPage('experience');
    }
  };

  const handleSubmit = () => {
    alert('Resume submitted successfully!');
  };

  const renderPersonalPage = () => (
    <>
      <div className="personal-info-header">
        <h2>Personal Information</h2>
        <div className="info-line"></div>
      </div>

      <div className="form-fields">
        <div className="field-group">
          <label>Name:</label>
          <input type="text" className="input-field" defaultValue="Sal Khan" />
        </div>

        <div className="field-group">
          <label>Email:</label>
          <input type="email" className="input-field" defaultValue="hello@khanacademy.org" />
        </div>

        <div className="field-group">
          <label>Date of Birth:</label>
          <input type="date" className="input-field" defaultValue="1976-10-11" />
        </div>

        <div className="field-group">
          <label>Phone:</label>
          <input type="tel" className="input-field" defaultValue="(123) 456-7890" />
        </div>

        <div className="field-group">
          <label>Address:</label>
          <input 
            type="text" 
            className={`input-field ${showAddressDetails ? 'expanded' : ''}`}
            onClick={handleAddressClick}
            defaultValue="123 Main Street"
            placeholder="Click to expand address details"
          />
        </div>

        {showAddressDetails && (
          <div className="address-details">
            <div className="field-group">
              <label>City:</label>
              <input type="text" className="input-field city-field" defaultValue="Mountain View" />
            </div>

            <div className="field-row">
              <div className="field-group half-width">
                <label>District:</label>
                <input type="text" className="input-field" defaultValue="Santa Clara County" />
              </div>
              <div className="field-group half-width">
                <label>Country:</label>
                <input type="text" className="input-field" defaultValue="USA" />
              </div>
            </div>

            <div className="field-group">
              <label>Zip Code:</label>
              <input type="text" className="input-field" defaultValue="94041" />
            </div>

            <div className="field-group">
              <label>Country:</label>
              <input type="text" className="input-field" defaultValue="United States" />
            </div>
          </div>
        )}
      </div>
    </>
  );

  const renderExperiencePage = () => (
    <>
      <div className="personal-info-header">
        <h2>Experience</h2>
        <div className="info-line"></div>
      </div>

      <div className="form-fields">
        <div className="field-group">
          <label>Employer Name:</label>
          <input type="text" className="input-field" defaultValue="Khan Academy" />
        </div>

        <div className="field-group">
          <label>Job Title:</label>
          <input type="text" className="input-field" defaultValue="Founder & CEO" />
        </div>

        <div className="field-row">
          <div className="field-group half-width">
            <label>City:</label>
            <input type="text" className="input-field" defaultValue="Mountain View" />
          </div>
          <div className="field-group half-width">
            <label>State:</label>
            <input type="text" className="input-field" defaultValue="California" />
          </div>
        </div>

        <div className="field-row">
          <div className="field-group half-width">
            <label>Start Date</label>
            <input type="date" className="input-field" defaultValue="2008-01-01" />
          </div>
          <div className="field-group half-width">
            <label>End Date:</label>
            <input type="date" className="input-field" defaultValue="2024-12-31" />
          </div>
        </div>

        <div className="field-group">
          <div className="current-job-checkbox">
            <input type="checkbox" id="currentJob" className="checkbox-input" defaultChecked />
            <label htmlFor="currentJob" className="checkbox-label">Set as Current Job</label>
          </div>
        </div>

        <div className="field-group">
          <label>Job Description</label>
          <textarea 
            className="input-field textarea-field" 
            rows="4" 
            defaultValue="Founded and led Khan Academy, a non-profit educational organization. Developed innovative online learning platform serving millions of students worldwide. Created comprehensive curriculum covering mathematics, science, and humanities."
          ></textarea>
        </div>
      </div>
    </>
  );

  const renderEducationPage = () => (
    <>
      <div className="personal-info-header">
        <h2>Education</h2>
        <div className="info-line"></div>
      </div>

      <div className="form-fields">
        <div className="field-group">
          <label>School Name:</label>
          <input type="text" className="input-field" defaultValue="Harvard Business School" />
        </div>

        <div className="field-group">
          <label>Degree:</label>
          <input type="text" className="input-field" defaultValue="Master of Business Administration" />
        </div>

        <div className="field-group">
          <label>Field of Study:</label>
          <input type="text" className="input-field" defaultValue="Business Administration" />
        </div>

        <div className="field-group">
          <label>Graduation</label>
          <input type="date" className="input-field" defaultValue="2003-05-15" />
        </div>

        <div className="field-row">
          <div className="field-group half-width">
            <label>City:</label>
            <input type="text" className="input-field" defaultValue="Boston" />
          </div>
          <div className="field-group half-width">
            <label>State:</label>
            <input type="text" className="input-field" defaultValue="Massachusetts" />
          </div>
        </div>

        <div className="field-row">
          <div className="field-group half-width">
            <label>Start Date</label>
            <input type="date" className="input-field" defaultValue="2001-09-01" />
          </div>
          <div className="field-group half-width">
            <label>End Date:</label>
            <input type="date" className="input-field" defaultValue="2003-05-15" />
          </div>
        </div>

        <div className="field-group">
          <div className="current-job-checkbox">
            <input type="checkbox" id="currentInstitute" className="checkbox-input" />
            <label htmlFor="currentInstitute" className="checkbox-label">Set as Current Institute</label>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="resume-container">
      <div className="resume-header">
        <div className="header-line"></div>
      </div>

      <div className="content-wrapper">
        <div className="left-section">
          <div className="photo-placeholder">
            {currentPage === 'personal' && (
              <div className="page-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span className="icon-label">Personal Info</span>
              </div>
            )}
            {currentPage === 'experience' && (
              <div className="page-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
                <span className="icon-label">Work Experience</span>
              </div>
            )}
            {currentPage === 'education' && (
              <div className="page-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                </svg>
                <span className="icon-label">Education</span>
              </div>
            )}
          </div>
        </div>

        <div className="right-section">
          {currentPage === 'personal' && renderPersonalPage()}
          {currentPage === 'experience' && renderExperiencePage()}
          {currentPage === 'education' && renderEducationPage()}
        </div>
      </div>

      <div className="navigation">
        {(currentPage === 'experience' || currentPage === 'education') && (
          <button className="nav-button prev-button" onClick={handlePrevPage}>
            Prev
          </button>
        )}
        {currentPage === 'personal' && (
          <button className="nav-button next-button" onClick={handleNextPage}>
            Next
          </button>
        )}
        {currentPage === 'experience' && (
          <button className="nav-button next-button" onClick={handleNextPage}>
            Next
          </button>
        )}
        {currentPage === 'education' && (
          <button className="nav-button submit-nav-button" onClick={handleSubmit}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;