import React from 'react';

// ADD VALIDATION FUNCTION AT THE TOP
const validateDate = (date, type) => {
  if (!date) return date; // Allow empty dates
  
  const selectedDate = new Date(date);
  const today = new Date();
  
  if (type === 'achievementDate' && selectedDate > today) {
    alert("Achievement date cannot be in the future!");
    return '';
  }
  
  return date;
};

const Achievements = ({
  achievements,
  currentAchievementIndex,
  setCurrentAchievementIndex,
  updateAchievement,
  addNewAchievement,
  removeAchievement
}) => {
  const currentAchievement = achievements?.[currentAchievementIndex] ?? {
    title: '',
    organization: '',
    dateReceived: '',
    category: '',
    description: '',
    website: ''
  };

  // UPDATED HANDLER WITH VALIDATION
  const handleDateReceivedChange = (e) => {
    const validatedValue = validateDate(e.target.value, 'achievementDate');
    updateAchievement('dateReceived', validatedValue);
  };

  return (
    <>
      <div className="personal-info-header">
        <h2>Achievements </h2>
        <div className="info-line3"></div>
      </div>

      <div className="form-fields">
        <div className="experience-navigation">
          {achievements.length > 1 && (
            <div className="experience-tabs">
              {achievements.map((_, index) => (
                <button
                  key={index}
                  className={`tab-button ${index === currentAchievementIndex ? 'active' : ''}`}
                  onClick={() => setCurrentAchievementIndex(index)}
                >
                  Achievement {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="field-group">
          <label className="required">Achievement Title:</label>
          <input 
            type="text" 
            className="input-field" 
            value={currentAchievement.title}
            onChange={(e) => updateAchievement('title', e.target.value)}
            placeholder="Forbes 30 Under 30"
          />
        </div>

        <div className="field-group">
          <label className="required">Organization/Institution:</label>
          <input 
            type="text" 
            className="input-field" 
            value={currentAchievement.organization}
            onChange={(e) => updateAchievement('organization', e.target.value)}
            placeholder="Forbes Magazine"
          />
        </div>

        <div className="field-row">
          <div className="field-group half-width">
            <label>Date Received:</label>
            <input
              type="date"
              className="input-field"
              value={currentAchievement?.dateReceived ?? ''}
              onChange={handleDateReceivedChange}
            />
          </div>
          <div className="field-group half-width">
            <label>Category:</label>
            <select
              className="input-field"
              value={currentAchievement?.category || ''}
              onChange={(e) => updateAchievement('category', e.target.value)}
            >
              <option value="">Select Category</option>
              <option value="Academic">Academic</option>
              <option value="Professional">Professional</option>
              <option value="Leadership">Leadership</option>
              <option value="Innovation">Innovation</option>
              <option value="Community Service">Community Service</option>
              <option value="Sports">Sports</option>
              <option value="Arts">Arts</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Custom Category Input - Shows when "Other" is selected */}
        {currentAchievement.category === 'Other' && (
          <div className="field-group">
            <label>Please specify category:</label>
            <input
              type="text"
              className="input-field"
              value={currentAchievement?.category || ''}
              onChange={(e) => updateAchievement('category', e.target.value)}
              placeholder="Enter your custom category"
            />
          </div>
        )}

        <div className="field-group">
          <label>Description</label>
          <textarea
            className="input-field textarea-field"
            rows="4"
            value={currentAchievement?.description || ''}
            onChange={(e) => updateAchievement('description', e.target.value)}
            placeholder="Recognized for revolutionary impact on education through Khan Academy, transforming how millions learn mathematics and science globally."
          ></textarea>
        </div>

        <div className="field-group">
          <label>Website/Link (Optional):</label>
          <input
            type="url"
            className="input-field"
            value={currentAchievement?.website || ''}
            onChange={(e) => updateAchievement('website', e.target.value)}
            placeholder="https://forbes.com/30-under-30/education"
          />
        </div>

        <div className="action-buttons">
          <button className="add-button" onClick={addNewAchievement}>
            + Add Another Achievement
          </button>
          {achievements.length > 1 && (
            <button
              className="remove-button"
              onClick={() => removeAchievement(currentAchievementIndex)}
            >
              Remove This Achievement
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Achievements;