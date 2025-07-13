import React, { useState } from 'react';
import './ProfileForm.css';

const ProfileForm = () => {
  const [currentPage, setCurrentPage] = useState('personal');
  const [showAddressDetails, setShowAddressDetails] = useState(false);
  const [isCurrentJob, setIsCurrentJob] = useState(true);
  const [isCurrentInstitute, setIsCurrentInstitute] = useState(false);

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

  const handleCurrentJobChange = (e) => {
    setIsCurrentJob(e.target.checked);
  };

  const handleCurrentInstituteChange = (e) => {
    setIsCurrentInstitute(e.target.checked);
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
          <input type="text" className="input-field" placeholder="Sal Khan" />
        </div>

        <div className="field-group">
          <label>Email:</label>
          <input type="email" className="input-field" placeholder="hello@khanacademy.org" />
        </div>

        <div className="field-group">
          <label>Date of Birth:</label>
          <input type="date" className="input-field" placeholder="1976-10-11" />
        </div>

        <div className="field-group">
          <label>Phone:</label>
          <input type="tel" className="input-field" placeholder="(123) 456-7890" />
        </div>

        <div className="field-group">
          <label>Address:</label>
          <input 
            type="text" 
            className={`input-field ${showAddressDetails ? 'expanded' : ''}`}
            onClick={handleAddressClick}
            placeholder="123 Main Street"
            
          />
        </div>

        {showAddressDetails && (
          <div className="address-details">
            <div className="field-group">
              <label>City:</label>
              <input type="text" className="input-field city-field" placeholder="Mountain View" />
            </div>

            <div className="field-row">
              <div className="field-group half-width">
                <label>District:</label>
                <input type="text" className="input-field" placeholder="Santa Clara County" />
              </div>
              <div className="field-group half-width">
                <label>Country:</label>
                <input type="text" className="input-field" placeholder="USA" />
              </div>
            </div>

            <div className="field-group">
              <label>Zip Code:</label>
              <input type="text" className="input-field" placeholder="94041" />
            </div>

            <div className="field-group">
              <label>Country:</label>
              <input type="text" className="input-field" placeholder="United States" />
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
          <input type="text" className="input-field" placeholder="Khan Academy" />
        </div>

        <div className="field-group">
          <label>Job Title:</label>
          <input type="text" className="input-field" placeholder="Founder & CEO" />
        </div>

        <div className="field-row">
          <div className="field-group half-width">
            <label>City:</label>
            <input type="text" className="input-field" placeholder="Mountain View" />
          </div>
          <div className="field-group half-width">
            <label>State:</label>
            <input type="text" className="input-field" placeholder="California" />
          </div>
        </div>

        <div className="field-row">
          <div className="field-group half-width">
            <label>Start Date</label>
            <input type="date" className="input-field" placeholder="2008-01-01" />
          </div>
          <div className="field-group half-width">
            <label>End Date:</label>
            <input 
              type="date" 
              className={`input-field ${isCurrentJob ? 'disabled-field' : ''}`}
              placeholder="2024-12-31" 
              disabled={isCurrentJob}
            />
          </div>
        </div>

        <div className="field-group">
          <div className="current-job-checkbox">
            <input 
              type="checkbox" 
              id="currentJob" 
              className="checkbox-input" 
              checked={isCurrentJob}
              onChange={handleCurrentJobChange}
            />
            <label htmlFor="currentJob" className="checkbox-label">Set as Current Job</label>
          </div>
        </div>

        <div className="field-group">
          <label>Job Description</label>
          <textarea 
            className="input-field textarea-field" 
            rows="4" 
            placeholder="Founded and led Khan Academy, a non-profit educational organization. Developed innovative online learning platform serving millions of students worldwide. Created comprehensive curriculum covering mathematics, science, and humanities."
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
          <input type="text" className="input-field" placeholder="Harvard Business School" />
        </div>

        <div className="field-group">
          <label>Degree:</label>
          <input type="text" className="input-field" placeholder="Master of Business Administration" />
        </div>

        <div className="field-group">
          <label>Field of Study:</label>
          <input type="text" className="input-field" placeholder="Business Administration" />
        </div>

        <div className="field-group">
          <label>Graduation</label>
          <input type="date" className="input-field" placeholder="2003-05-15" />
        </div>

        <div className="field-row">
          <div className="field-group half-width">
            <label>City:</label>
            <input type="text" className="input-field" placeholder="Boston" />
          </div>
          <div className="field-group half-width">
            <label>State:</label>
            <input type="text" className="input-field" placeholder="Massachusetts" />
          </div>
        </div>

        <div className="field-row">
          <div className="field-group half-width">
            <label>Start Date</label>
            <input type="date" className="input-field" placeholder="2001-09-01" />
          </div>
          <div className="field-group half-width">
            <label>End Date:</label>
            <input 
              type="date" 
              className={`input-field ${isCurrentInstitute ? 'disabled-field' : ''}`}
              placeholder="2003-05-15" 
              disabled={isCurrentInstitute}
            />
          </div>
        </div>

        <div className="field-group">
          <div className="current-job-checkbox">
            <input 
              type="checkbox" 
              id="currentInstitute" 
              className="checkbox-input" 
              checked={isCurrentInstitute}
              onChange={handleCurrentInstituteChange}
            />
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
              <div className="page-image">
                <img 
                  src="/Personaldata.png" 
                  alt="Personal Information" 
                  className="page-img"
                />
                
              </div>
            )}
            {currentPage === 'experience' && (
              <div className="page-image">
                <img 
                  src="/Experience.png"
                  alt="Work Experience" 
                  className="page-img"
                />
                
              </div>
            )}
            {currentPage === 'education' && (
              <div className="page-image">
                <img 
                  src="/Education.png" 
                  alt="Education" 
                  className="page-img"
                />
                
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