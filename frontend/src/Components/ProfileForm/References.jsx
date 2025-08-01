import React from 'react';

const References = ({
  references,
  currentReferenceIndex,
  setCurrentReferenceIndex,
  updateReference,
  addNewReference,
  removeReference
}) => {
  const currentReference = references?.[currentReferenceIndex] ?? {
    firstName: '',
    lastName: '',
    jobTitle: '',
    company: '',
    referenceEmail: '',
    phone: '',
    relationship: '',
    description: '',
    permissionToContact: false
  };


  return (
    <>
      <div className="personal-info-header">
        <h2>References </h2>
        <div className="info-line3"></div>
      </div>

      <div className="form-fields">
        <div className="experience-navigation">
          {references.length > 1 && (
            <div className="experience-tabs">
              {references.map((_, index) => (
                <button
                  key={index}
                  className={`tab-button ${index === currentReferenceIndex ? 'active' : ''}`}
                  onClick={() => setCurrentReferenceIndex(index)}
                >
                  Reference {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="field-row">
          <div className="field-group half-width">
            <label>First Name:</label>
            <input
              type="text"
              className="input-field"
              value={currentReference?.firstName || ''}
              onChange={(e) => updateReference('firstName', e.target.value)}
              placeholder="Bill"
            />
          </div>
          <div className="field-group half-width">
            <label>Last Name:</label>
            <input
              type="text"
              className="input-field"
              value={currentReference?.lastName || ''}
              onChange={(e) => updateReference('lastName', e.target.value)}
              placeholder="Gates"
            />
          </div>
        </div>

        <div className="field-group">
          <label>Job Title:</label>
          <input
            type="text"
            className="input-field"
            value={currentReference?.jobTitle || ''}
            onChange={(e) => updateReference('jobTitle', e.target.value)}
            placeholder="Co-founder, Bill & Melinda Gates Foundation"
          />
        </div>

        <div className="field-group">
          <label>Company/Organization:</label>
          <input
            type="text"
            className="input-field"
            value={currentReference?.company || ''}
            onChange={(e) => updateReference('company', e.target.value)}
            placeholder="Microsoft Corporation"
          />
        </div>

        <div className="field-row">
          <div className="field-group half-width">
            <label>Email:</label>
            <input
              type="email"
              className="input-field"
              value={currentReference?.referenceEmail || ''}
              onChange={(e) => updateReference('referenceEmail', e.target.value)}
              placeholder="bill.gates@microsoft.com"
            />
          </div>
          <div className="field-group half-width">
            <label>Phone:</label>
            <input
              type="tel"
              className="input-field"
              value={currentReference?.phone || ''}
              onChange={(e) => updateReference('phone', e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        <div className="field-group">
          <label>Relationship:</label>
          <select
            className="input-field"
            value={currentReference?.relationship || ''}
            onChange={(e) => updateReference('relationship', e.target.value)}
          >
            <option value="">Select Relationship</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Manager">Manager</option>
            <option value="Colleague">Colleague</option>
            <option value="Client">Client</option>
            <option value="Professor">Professor</option>
            <option value="Mentor">Mentor</option>
            <option value="Business Partner">Business Partner</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Custom Relationship Input - Shows when "Other" is selected */}
        {currentReference.relationship === 'Other' && (
          <div className="field-group">
            <label>Please specify relationship:</label>
            <input
              type="text"
              className="input-field"
              value={currentReference?.relationship || ''}
              onChange={(e) => updateReference('relationship', e.target.value)}
              placeholder="Enter your custom relationship"
            />
          </div>
        )}

        <div className="field-group">
          <label>How do you know this person?</label>
          <textarea
            className="input-field textarea-field"
            rows="3"
            value={currentReference?.description || ''}
            onChange={(e) => updateReference('description', e.target.value)}
            placeholder="Bill mentored me during the early development of Khan Academy and provided strategic guidance on scaling educational technology platforms."
          ></textarea>
        </div>

        <div className="field-group">
          <div className="current-job-checkbox">
            <input
              type="checkbox"
              id={`permissionToContact${currentReferenceIndex}`}
              className="checkbox-input"
              checked={currentReference.permissionToContact}
              onChange={(e) => updateReference('permissionToContact', e.target.checked)}
            />
            <label htmlFor={`permissionToContact${currentReferenceIndex}`} className="checkbox-label">Permission to contact this reference</label>
          </div>
        </div>

        <div className="action-buttons">
          <button className="add-button" onClick={addNewReference}>
            + Add Another Reference
          </button>
          {references.length > 1 && (
            <button
              className="remove-button"
              onClick={() => removeReference(currentReferenceIndex)}
            >
              Remove This Reference
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default References;