import React from 'react';

const Education = ({ 
  educations, 
  currentEducationIndex, 
  setCurrentEducationIndex, 
  updateEducation, 
  addNewEducation, 
  removeEducation 
}) => {
  const currentEdu = educations[currentEducationIndex];

  return (
    <>
      <div className="personal-info-header">
        <h2>Education </h2>
        <div className="info-line"></div>
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
          <label>School Name:</label>
          <input 
            type="text" 
            className="input-field" 
            value={currentEdu.schoolName}
            onChange={(e) => updateEducation('schoolName', e.target.value)}
            placeholder="Harvard Business School" 
          />
        </div>

        <div className="field-group">
          <label>Degree:</label>
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
            value={currentEdu.graduation}
            onChange={(e) => updateEducation('graduation', e.target.value)}
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
              onChange={(e) => updateEducation('startDate', e.target.value)}
            />
          </div>
          <div className="field-group half-width">
            <label>End Date:</label>
            <input 
              type="date" 
              className={`input-field ${currentEdu.isCurrent ? 'disabled-field' : ''}`}
              value={currentEdu.endDate}
              onChange={(e) => updateEducation('endDate', e.target.value)}
              disabled={currentEdu.isCurrent}
            />
          </div>
        </div>

        <div className="field-group">
          <div className="current-job-checkbox">
            <input 
              type="checkbox" 
              id={`currentInstitute${currentEducationIndex}`}
              className="checkbox-input" 
              checked={currentEdu.isCurrent}
              onChange={(e) => updateEducation('isCurrent', e.target.checked)}
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