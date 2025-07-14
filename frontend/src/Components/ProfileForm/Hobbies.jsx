import React from 'react';

const Hobbies = ({ 
  hobbies, 
  currentHobbyIndex, 
  setCurrentHobbyIndex, 
  updateHobby, 
  addNewHobby, 
  removeHobby 
}) => {
  const currentHobby = hobbies[currentHobbyIndex];

  return (
    <>
      <div className="personal-info-header">
        <h2>Hobbies </h2>
        <div className="info-line"></div>
      </div>

      <div className="form-fields">
        <div className="experience-navigation">
          {hobbies.length > 1 && (
            <div className="experience-tabs">
              {hobbies.map((_, index) => (
                <button
                  key={index}
                  className={`tab-button ${index === currentHobbyIndex ? 'active' : ''}`}
                  onClick={() => setCurrentHobbyIndex(index)}
                >
                  Hobby {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="field-group">
          <label>Hobby Name:</label>
          <input 
            type="text" 
            className="input-field" 
            value={currentHobby.hobbyName}
            onChange={(e) => updateHobby('hobbyName', e.target.value)}
            placeholder="Photography" 
          />
        </div>

        <div className="field-row">
          <div className="field-group half-width">
            <label>Experience Level:</label>
            <select 
              className="input-field" 
              value={currentHobby.experienceLevel}
              onChange={(e) => updateHobby('experienceLevel', e.target.value)}
            >
              <option value="">Select Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
          <div className="field-group half-width">
            <label>Years Involved:</label>
            <input 
              type="number" 
              className="input-field" 
              value={currentHobby.yearsInvolved}
              onChange={(e) => updateHobby('yearsInvolved', e.target.value)}
              placeholder="5" 
              min="0"
              max="50"
            />
          </div>
        </div>

        <div className="field-group">
          <label>Category:</label>
          <select 
            className="input-field" 
            value={currentHobby.category}
            onChange={(e) => updateHobby('category', e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="Arts & Crafts">Arts & Crafts</option>
            <option value="Sports & Fitness">Sports & Fitness</option>
            <option value="Music & Entertainment">Music & Entertainment</option>
            <option value="Reading & Writing">Reading & Writing</option>
            <option value="Technology">Technology</option>
            <option value="Travel & Adventure">Travel & Adventure</option>
            <option value="Cooking & Food">Cooking & Food</option>
            <option value="Gaming">Gaming</option>
            <option value="Collecting">Collecting</option>
            <option value="Outdoor Activities">Outdoor Activities</option>
            <option value="Volunteering">Volunteering</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="field-group">
          <label>Description</label>
          <textarea 
            className="input-field textarea-field" 
            rows="4" 
            value={currentHobby.description}
            onChange={(e) => updateHobby('description', e.target.value)}
            placeholder="Passionate about landscape and portrait photography. Enjoy capturing natural beauty and human emotions through my lens. Have participated in several local exhibitions and love experimenting with different techniques."
          ></textarea>
        </div>

        <div className="field-group">
          <label>Achievements/Recognition (Optional):</label>
          <input 
            type="text" 
            className="input-field" 
            value={currentHobby.achievements}
            onChange={(e) => updateHobby('achievements', e.target.value)}
            placeholder="Winner of Local Photography Contest 2023" 
          />
        </div>

        <div className="action-buttons">
          <button className="add-button" onClick={addNewHobby}>
            + Add Another Hobby
          </button>
          {hobbies.length > 1 && (
            <button 
              className="remove-button" 
              onClick={() => removeHobby(currentHobbyIndex)}
            >
              Remove This Hobby
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Hobbies;