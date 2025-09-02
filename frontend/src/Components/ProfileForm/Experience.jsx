import React from 'react';

// VALIDATION FUNCTION WITH FULL LOGIC
const validateDate = (date, type, relatedDate = null) => {
  if (!date) return date; // Allow empty dates
  
  const selectedDate = new Date(date);
  const today = new Date();
  const currentYear = today.getFullYear();
  
  switch (type) {
    case 'startDate':
      if (selectedDate > today) {
        alert("Start date cannot be in the future!");
        return '';
      }
      // Check if start date is after existing end date
      if (relatedDate && selectedDate > new Date(relatedDate)) {
        alert("Start date cannot be after end date!");
        return '';
      }
      break;
      
    case 'endDate':
      if (relatedDate && selectedDate < new Date(relatedDate)) {
        alert("End date cannot be before start date!");
        return relatedDate;
      }
      const maxEndDate = new Date(currentYear + 5, 11, 31);
      if (selectedDate > maxEndDate) {
        alert("End date seems too far in the future!");
        return '';
      }
      break;
  }
  
  return date;
};

const Experience = ({ 
  experiences, 
  currentExperienceIndex, 
  setCurrentExperienceIndex, 
  updateExperience, 
  addNewExperience, 
  removeExperience 
}) => {
  const currentExp = experiences[currentExperienceIndex];

  // UPDATED HANDLERS WITH VALIDATION
  const handleStartDateChange = (e) => {
    const validatedValue = validateDate(e.target.value, 'startDate', currentExp.endDate);
    updateExperience('startDate', validatedValue);
  };

  const handleEndDateChange = (e) => {
    const validatedValue = validateDate(e.target.value, 'endDate', currentExp.startDate);
    updateExperience('endDate', validatedValue);
  };

  return (
    <>
      <div className="personal-info-header">
        <h2>Experience </h2>
        <div className="info-line3"></div>
      </div>

      <div className="form-fields">
        <div className="experience-navigation">
          {experiences.length > 1 && (
            <div className="experience-tabs">
              {experiences.map((_, index) => (
                <button
                  key={index}
                  className={`tab-button ${index === currentExperienceIndex ? 'active' : ''}`}
                  onClick={() => setCurrentExperienceIndex(index)}
                >
                  Experience {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="field-group">
          <label className="required">Employer Name:</label>
          <input 
            type="text" 
            className="input-field" 
            value={currentExp.employerName}
            onChange={(e) => updateExperience('employerName', e.target.value)}
            placeholder="Khan Academy" 
          />
        </div>

        <div className="field-group">
          <label className="required">Job Title:</label>
          <input 
            type="text" 
            className="input-field" 
            value={currentExp.jobTitle}
            onChange={(e) => updateExperience('jobTitle', e.target.value)}
            placeholder="Founder & CEO" 
          />
        </div>

        <div className="field-row">
          <div className="field-group half-width">
            <label>City:</label>
            <input 
              type="text" 
              className="input-field" 
              value={currentExp.city}
              onChange={(e) => updateExperience('city', e.target.value)}
              placeholder="Mountain View" 
            />
          </div>
          <div className="field-group half-width">
            <label>State:</label>
            <input 
              type="text" 
              className="input-field" 
              value={currentExp.state}
              onChange={(e) => updateExperience('state', e.target.value)}
              placeholder="California" 
            />
          </div>
        </div>

        <div className="field-row">
          <div className="field-group half-width">
            <label className="required">Start Date</label>
            <input 
              type="date" 
              className="input-field" 
              value={currentExp.startDate}
              onChange={handleStartDateChange}
            />
          </div>
          <div className="field-group half-width">
            <label>End Date:</label>
            <input 
              type="date" 
              className={`input-field ${currentExp.isCurrentJob ? 'disabled-field' : ''}`}
              value={currentExp.endDate}
              onChange={handleEndDateChange}
              disabled={currentExp.isCurrentJob}
            />
          </div>
        </div>

        <div className="field-group">
          <div className="current-job-checkbox">
            <input 
              type="checkbox" 
              id={`currentJob${currentExperienceIndex}`}
              className="checkbox-input" 
              checked={currentExp.isCurrentJob}
              onChange={(e) => updateExperience('isCurrentJob', e.target.checked)}
            />
            <label htmlFor={`currentJob${currentExperienceIndex}`} className="checkbox-label">Set as Current Job</label>
          </div>
        </div>

        <div className="field-group">
          <label>Job Description</label>
          <textarea 
            className="input-field textarea-field" 
            rows="4" 
            value={currentExp.description}
            onChange={(e) => updateExperience('description', e.target.value)}
            placeholder="Founded and led Khan Academy, a non-profit educational organization..."
          ></textarea>
        </div>

        <div className="action-buttons">
          <button className="add-button" onClick={addNewExperience}>
            + Add Another Experience
          </button>
          {experiences.length > 1 && (
            <button 
              className="remove-button" 
              onClick={() => removeExperience(currentExperienceIndex)}
            >
              Remove This Experience
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Experience;