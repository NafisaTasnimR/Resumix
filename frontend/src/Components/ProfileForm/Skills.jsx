import React from 'react';

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const normalizeLevel = (v = '') => {
  const t = String(v).trim().toLowerCase();
  if (t === 'intermidiate') return 'Intermediate'; // typo -> correct
  const found = SKILL_LEVELS.find(l => l.toLowerCase() === t);
  return found || 'Beginner';
};


const Skills = ({
  skills,
  currentSkillIndex,
  setCurrentSkillIndex,
  updateSkill,
  addNewSkill,
  removeSkill
}) => {
  const currentSkill = skills[currentSkillIndex];

  return (
    <>
      <div className="personal-info-header">
        <h2>Skills </h2>
        <div className="info-line3"></div>
      </div>

      <div className="form-fields">
        <div className="experience-navigation">
          {skills.length > 1 && (
            <div className="experience-tabs">
              {skills.map((_, index) => (
                <button
                  key={index}
                  className={`tab-button ${index === currentSkillIndex ? 'active' : ''}`}
                  onClick={() => setCurrentSkillIndex(index)}
                >
                  Skill {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="field-group">

          <label className="required">Skill Name:</label>
          <input
            type="text"
            className="input-field"
            value={currentSkill?.skillName || ''}

            onChange={(e) => updateSkill('skillName', e.target.value)}
            placeholder="JavaScript"
          />
        </div>

        <div className="field-row">
          <div className="field-group half-width">
            <label>Proficiency Level:</label>
            <select
              className="input-field"

              value={currentSkill?.proficiencyLevel || ''}
              onChange={(e) => updateSkill('proficiencyLevel', e.target.value)}

            >
              <option value="">Select Level</option>
              {SKILL_LEVELS.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <div className="field-group half-width">
            <label>Years of Experience:</label>
            <input
              type="number"
              className="input-field"
              value={currentSkill?.yearsOfExperience ?? 0}
              onChange={(e) => updateSkill('yearsOfExperience', Number(e.target.value))}

              placeholder="10"
              min="0"
              max="50"
            />
          </div>
        </div>

        <div className="field-group">
          <label>Skill Description</label>
          <textarea
            className="input-field textarea-field"
            rows="4"

            value={currentSkill?.skillDescription || ''}

            onChange={(e) => updateSkill('skillDescription', e.target.value)}
            placeholder="Full-stack JavaScript development including React, Node.js, and modern frameworks"
          ></textarea>
        </div>

        <div className="action-buttons">
          <button className="add-button" onClick={addNewSkill}>
            + Add Another Skill
          </button>
          {skills.length > 1 && (
            <button
              className="remove-button"
              onClick={() => removeSkill(currentSkillIndex)}
            >
              Remove This Skill
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Skills;
