import React from 'react';

const AdditionalInfo = ({ 
  additionalInfos, 
  currentAdditionalInfoIndex, 
  setCurrentAdditionalInfoIndex, 
  updateAdditionalInfo, 
  addNewAdditionalInfo, 
  removeAdditionalInfo 
}) => {
  const currentInfo = additionalInfos[currentAdditionalInfoIndex];

  return (
    <>
    
      <div className="personal-info-header">
         
        <h2>Additional Information </h2>
        <div className="info-line3"></div>
      </div>

      <div className="form-fields">
        <div className="experience-navigation">
          {additionalInfos.length > 1 && (
            <div className="experience-tabs">
              {additionalInfos.map((_, index) => (
                <button
                  key={index}
                  className={`tab-button ${index === currentAdditionalInfoIndex ? 'active' : ''}`}
                  onClick={() => setCurrentAdditionalInfoIndex(index)}
                >
                  Info {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="field-group">
          <label>Section Title:</label>
          <input 
            type="text" 
            className="input-field" 
            value={currentInfo?.sectionTitle || ''}
            onChange={(e) => updateAdditionalInfo('sectionTitle', e.target.value)}
            placeholder="Languages" 
          />
        </div>

        <div className="field-group">
          <label>Information:</label>
          <textarea 
            className="input-field textarea-field" 
            rows="8" 
            value={currentInfo?.content || ''}
            onChange={(e) => updateAdditionalInfo('content', e.target.value)}
            placeholder="Write the description here"
          ></textarea>
        </div>

        <div className="action-buttons">
          <button className="add-button" onClick={addNewAdditionalInfo}>
            + Add Another Section
          </button>
          {additionalInfos.length > 1 && (
            <button 
              className="remove-button" 
              onClick={() => removeAdditionalInfo(currentAdditionalInfoIndex)}
            >
              Remove This Section
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default AdditionalInfo;