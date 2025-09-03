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
      
    case 'graduationDate':
      const maxGradDate = new Date(currentYear + 6, 11, 31);
      if (selectedDate > maxGradDate) {
        alert("Graduation date seems too far in the future!");
        return '';
      }
      break;
  }
  
  return date;
};

const Education = ({ 
  educations, 
  currentEducationIndex, 
  setCurrentEducationIndex, 
  updateEducation, 
  addNewEducation, 
  removeEducation 
}) => {
  const currentEdu = educations[currentEducationIndex];

  // UPDATED HANDLERS WITH VALIDATION
  const handleStartDateChange = (e) => {
    const validatedValue = validateDate(e.target.value, 'startDate', currentEdu.endDate);
    updateEducation('startDate', validatedValue);
  };

  const handleEndDateChange = (e) => {
    const validatedValue = validateDate(e.target.value, 'endDate', currentEdu.startDate);
    updateEducation('endDate', validatedValue);
  };

  const handleGraduationDateChange = (e) => {
    const validatedValue = validateDate(e.target.value, 'graduationDate');
    updateEducation('graduationDate', validatedValue);
  };

  return (
    <>
      <div className="personal-info-header">
        <h2>Education </h2>
        <div className="info-line3"></div>
      </div>

      <div className="form-fields">
        <div className="experience-navigation">
          {educations.length > 1 && (
            <div className="experience-tabs">
              {educations.map((_, index) => (
                <button
                  key={index}
                  className={`tab-button ${index === currentEducationIndex ? 'active' : ''}`}
                  onClick={() => setCurrentEducationIndex(index)}
                >
                  Education {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="field-group">
          <label className="required">School Name:</label>
          <input 
            type="text" 
            className="input-field" 
            value={currentEdu.institution}
            onChange={(e) => updateEducation('institution', e.target.value)}
            placeholder="Harvard Business School" 
          />
        </div>

        <div className="field-group">
          <label className="required">Degree:</label>
          <input 
            type="text" 
            className="input-field" 
            value={currentEdu.degree}
            onChange={(e) => updateEducation('degree', e.target.value)}
            placeholder="Master of Business Administration" 
          />
        </div>

        <div className="field-group">
          <label>Field of Study:</label>
          <input 
            type="text" 
            className="input-field" 
            value={currentEdu.fieldOfStudy}
            onChange={(e) => updateEducation('fieldOfStudy', e.target.value)}
            placeholder="Business Administration" 
          />
        </div>

        <div className="field-group">
          <label>Graduation</label>
          <input 
            type="date" 
            className="input-field" 
            value={currentEdu.graduationDate}
            onChange={handleGraduationDateChange}
          />
        </div>

        <div className="field-row">
          <div className="field-group half-width">
            <label>City:</label>
            <input 
              type="text" 
              className="input-field" 
              value={currentEdu.city}
              onChange={(e) => updateEducation('city', e.target.value)}
              placeholder="Boston" 
            />
          </div>
          <div className="field-group half-width">
            <label>State:</label>
            <input 
              type="text" 
              className="input-field" 
              value={currentEdu.state}
              onChange={(e) => updateEducation('state', e.target.value)}
              placeholder="Massachusetts" 
            />
          </div>
        </div>

        <div className="field-row">
          <div className="field-group half-width">
            <label>Start Date</label>
            <input 
              type="date" 
              className="input-field" 
              value={currentEdu.startDate}
              onChange={handleStartDateChange}
            />
          </div>
          <div className="field-group half-width">
            <label>End Date:</label>
            <input 
              type="date" 
              className={`input-field ${currentEdu.isCurrentInstitution ? 'disabled-field' : ''}`}
              value={currentEdu.endDate}
              onChange={handleEndDateChange}
              disabled={currentEdu.isCurrentInstitution}
            />
          </div>
        </div>

        <div className="field-group">
          <div className="current-job-checkbox">
            <input 
              type="checkbox" 
              id={`currentInstitute${currentEducationIndex}`}
              className="checkbox-input" 
              checked={currentEdu.isCurrentInstitution}
              onChange={(e) => updateEducation('isCurrentInstitution', e.target.checked)}
            />
            <label htmlFor={`currentInstitute${currentEducationIndex}`} className="checkbox-label">Set as Current Institute</label>
          </div>
        </div>

        <div className="action-buttons">
          <button className="add-button" onClick={addNewEducation}>
            + Add Another Education
          </button>
          {educations.length > 1 && (
            <button 
              className="remove-button" 
              onClick={() => removeEducation(currentEducationIndex)}
            >
              Remove This Education
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Education;