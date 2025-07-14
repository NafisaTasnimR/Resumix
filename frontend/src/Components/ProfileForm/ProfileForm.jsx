import React, { useState } from 'react';
import './ProfileForm.css';

const ProfileForm = () => {
  const [currentPage, setCurrentPage] = useState('personal');
  const [showAddressDetails, setShowAddressDetails] = useState(false);
  const [experiences, setExperiences] = useState([
    {
      id: 1,
      employer: 'Khan Academy',
      jobTitle: 'Founder & CEO',
      city: 'Mountain View',
      state: 'California',
      startDate: '2008-01-01',
      endDate: '2024-12-31',
      isCurrent: true,
      description: 'Founded and led Khan Academy, a non-profit educational organization. Developed innovative online learning platform serving millions of students worldwide. Created comprehensive curriculum covering mathematics, science, and humanities.'
    }
  ]);
  const [educations, setEducations] = useState([
    {
      id: 1,
      schoolName: 'Harvard Business School',
      degree: 'Master of Business Administration',
      fieldOfStudy: 'Business Administration',
      graduation: '2003-05-15',
      city: 'Boston',
      state: 'Massachusetts',
      startDate: '2001-09-01',
      endDate: '2003-05-15',
      isCurrent: false
    }
  ]);
  const [skills, setSkills] = useState([
    {
      id: 1,
      skillName: 'JavaScript',
      proficiency: 'Expert',
      yearsOfExperience: '10',
      description: 'Full-stack JavaScript development including React, Node.js, and modern frameworks'
    }
  ]);
  const [currentExperienceIndex, setCurrentExperienceIndex] = useState(0);
  const [currentEducationIndex, setCurrentEducationIndex] = useState(0);
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);

  const handleAddressClick = () => {
    setShowAddressDetails(true);
  };

  const handleNextPage = () => {
    if (currentPage === 'personal') {
      setCurrentPage('experience');
    } else if (currentPage === 'experience') {
      setCurrentPage('education');
    } else if (currentPage === 'education') {
      setCurrentPage('skills');
    }
  };

  const handlePrevPage = () => {
    if (currentPage === 'experience') {
      setCurrentPage('personal');
    } else if (currentPage === 'education') {
      setCurrentPage('experience');
    } else if (currentPage === 'skills') {
      setCurrentPage('education');
    }
  };

  const handleSubmit = () => {
    alert('Resume submitted successfully!');
  };

  const addNewExperience = () => {
    const newExperience = {
      id: experiences.length + 1,
      employer: '',
      jobTitle: '',
      city: '',
      state: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: ''
    };
    setExperiences([...experiences, newExperience]);
    setCurrentExperienceIndex(experiences.length);
  };

  const addNewEducation = () => {
    const newEducation = {
      id: educations.length + 1,
      schoolName: '',
      degree: '',
      fieldOfStudy: '',
      graduation: '',
      city: '',
      state: '',
      startDate: '',
      endDate: '',
      isCurrent: false
    };
    setEducations([...educations, newEducation]);
    setCurrentEducationIndex(educations.length);
  };

  const addNewSkill = () => {
    const newSkill = {
      id: skills.length + 1,
      skillName: '',
      proficiency: '',
      yearsOfExperience: '',
      description: ''
    };
    setSkills([...skills, newSkill]);
    setCurrentSkillIndex(skills.length);
  };

  const removeExperience = (index) => {
    if (experiences.length > 1) {
      const newExperiences = experiences.filter((_, i) => i !== index);
      setExperiences(newExperiences);
      setCurrentExperienceIndex(Math.max(0, index - 1));
    }
  };

  const removeEducation = (index) => {
    if (educations.length > 1) {
      const newEducations = educations.filter((_, i) => i !== index);
      setEducations(newEducations);
      setCurrentEducationIndex(Math.max(0, index - 1));
    }
  };

  const removeSkill = (index) => {
    if (skills.length > 1) {
      const newSkills = skills.filter((_, i) => i !== index);
      setSkills(newSkills);
      setCurrentSkillIndex(Math.max(0, index - 1));
    }
  };

  const updateExperience = (field, value) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[currentExperienceIndex] = {
      ...updatedExperiences[currentExperienceIndex],
      [field]: value
    };
    setExperiences(updatedExperiences);
  };

  const updateEducation = (field, value) => {
    const updatedEducations = [...educations];
    updatedEducations[currentEducationIndex] = {
      ...updatedEducations[currentEducationIndex],
      [field]: value
    };
    setEducations(updatedEducations);
  };

  const updateSkill = (field, value) => {
    const updatedSkills = [...skills];
    updatedSkills[currentSkillIndex] = {
      ...updatedSkills[currentSkillIndex],
      [field]: value
    };
    setSkills(updatedSkills);
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
  

  const renderSkillsPage = () => {
    const currentSkill = skills[currentSkillIndex];
    
    return (
      <>
        <div className="personal-info-header">
          <h2>Skills </h2>
          <div className="info-line"></div>
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
            <label>Skill Name:</label>
            <input 
              type="text" 
              className="input-field" 
              value={currentSkill.skillName}
              onChange={(e) => updateSkill('skillName', e.target.value)}
              placeholder="JavaScript" 
            />
          </div>

          <div className="field-row">
            <div className="field-group half-width">
              <label>Proficiency Level:</label>
              <select 
                className="input-field" 
                value={currentSkill.proficiency}
                onChange={(e) => updateSkill('proficiency', e.target.value)}
              >
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            <div className="field-group half-width">
              <label>Years of Experience:</label>
              <input 
                type="number" 
                className="input-field" 
                value={currentSkill.yearsOfExperience}
                onChange={(e) => updateSkill('yearsOfExperience', e.target.value)}
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
              value={currentSkill.description}
              onChange={(e) => updateSkill('description', e.target.value)}
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

  const renderExperiencePage = () => {
    const currentExp = experiences[currentExperienceIndex];
    
    return (
      <>
        <div className="personal-info-header">
          <h2>Experience </h2>
          <div className="info-line"></div>
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
            <label>Employer Name:</label>
            <input 
              type="text" 
              className="input-field" 
              value={currentExp.employer}
              onChange={(e) => updateExperience('employer', e.target.value)}
              placeholder="Khan Academy" 
            />
          </div>

          <div className="field-group">
            <label>Job Title:</label>
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
              <label>Start Date</label>
              <input 
                type="date" 
                className="input-field" 
                value={currentExp.startDate}
                onChange={(e) => updateExperience('startDate', e.target.value)}
              />
            </div>
            <div className="field-group half-width">
              <label>End Date:</label>
              <input 
                type="date" 
                className={`input-field ${currentExp.isCurrent ? 'disabled-field' : ''}`}
                value={currentExp.endDate}
                onChange={(e) => updateExperience('endDate', e.target.value)}
                disabled={currentExp.isCurrent}
              />
            </div>
          </div>

          <div className="field-group">
            <div className="current-job-checkbox">
              <input 
                type="checkbox" 
                id={`currentJob${currentExperienceIndex}`}
                className="checkbox-input" 
                checked={currentExp.isCurrent}
                onChange={(e) => updateExperience('isCurrent', e.target.checked)}
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

  const renderEducationPage = () => {
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
            {currentPage === 'skills' && (
              <div className="page-image">
                <img 
                  src="/Skills.png" 
                  alt="Skills" 
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
          {currentPage === 'skills' && renderSkillsPage()}
        </div>
      </div>

      <div className="navigation">
        {(currentPage === 'experience' || currentPage === 'education' || currentPage === 'skills') && (
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
          <button className="nav-button next-button" onClick={handleNextPage}>
            Next
          </button>
        )}
        {currentPage === 'skills' && (
          <button className="nav-button submit-nav-button" onClick={handleSubmit}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;