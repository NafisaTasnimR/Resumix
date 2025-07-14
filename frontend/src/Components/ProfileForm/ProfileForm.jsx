import React, { useState } from 'react';
import './ProfileForm.css';
import PersonalInfo from './PersonalInfo';
import Experience from './Experience';
import Education from './Education';
import Skills from './Skills';

const ProfileForm = () => {
  const [currentPage, setCurrentPage] = useState('personal');
  const [showAddressDetails, setShowAddressDetails] = useState(false);
  
  // Experience state
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
  const [currentExperienceIndex, setCurrentExperienceIndex] = useState(0);

  // Education state
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
  const [currentEducationIndex, setCurrentEducationIndex] = useState(0);

  // Skills state
  const [skills, setSkills] = useState([
    {
      id: 1,
      skillName: 'JavaScript',
      proficiency: 'Expert',
      yearsOfExperience: '10',
      description: 'Full-stack JavaScript development including React, Node.js, and modern frameworks'
    }
  ]);
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);

  // Navigation functions
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

  // Experience functions
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

  const removeExperience = (index) => {
    if (experiences.length > 1) {
      const newExperiences = experiences.filter((_, i) => i !== index);
      setExperiences(newExperiences);
      setCurrentExperienceIndex(Math.max(0, index - 1));
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

  // Education functions
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

  const removeEducation = (index) => {
    if (educations.length > 1) {
      const newEducations = educations.filter((_, i) => i !== index);
      setEducations(newEducations);
      setCurrentEducationIndex(Math.max(0, index - 1));
    }
  };

  const updateEducation = (field, value) => {
    const updatedEducations = [...educations];
    updatedEducations[currentEducationIndex] = {
      ...updatedEducations[currentEducationIndex],
      [field]: value
    };
    setEducations(updatedEducations);
  };

  // Skills functions
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

  const removeSkill = (index) => {
    if (skills.length > 1) {
      const newSkills = skills.filter((_, i) => i !== index);
      setSkills(newSkills);
      setCurrentSkillIndex(Math.max(0, index - 1));
    }
  };

  const updateSkill = (field, value) => {
    const updatedSkills = [...skills];
    updatedSkills[currentSkillIndex] = {
      ...updatedSkills[currentSkillIndex],
      [field]: value
    };
    setSkills(updatedSkills);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'personal':
        return (
          <PersonalInfo 
            showAddressDetails={showAddressDetails}
            setShowAddressDetails={setShowAddressDetails}
          />
        );
      case 'experience':
        return (
          <Experience 
            experiences={experiences}
            currentExperienceIndex={currentExperienceIndex}
            setCurrentExperienceIndex={setCurrentExperienceIndex}
            updateExperience={updateExperience}
            addNewExperience={addNewExperience}
            removeExperience={removeExperience}
          />
        );
      case 'education':
        return (
          <Education 
            educations={educations}
            currentEducationIndex={currentEducationIndex}
            setCurrentEducationIndex={setCurrentEducationIndex}
            updateEducation={updateEducation}
            addNewEducation={addNewEducation}
            removeEducation={removeEducation}
          />
        );
      case 'skills':
        return (
          <Skills 
            skills={skills}
            currentSkillIndex={currentSkillIndex}
            setCurrentSkillIndex={setCurrentSkillIndex}
            updateSkill={updateSkill}
            addNewSkill={addNewSkill}
            removeSkill={removeSkill}
          />
        );
      default:
        return null;
    }
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
          {renderCurrentPage()}
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