import React, { useState } from 'react';
import './ProfileForm.css';
import PersonalInfo from './PersonalInfo';
import Experience from './Experience';
import Education from './Education';
import Skills from './Skills';
import Achievements from './Achievements';
import References from './References';
import Hobbies from './Hobbies';
import AdditionalInfo from './AdditionalInfo';
import { Link } from 'react-router-dom';


const ProfileForm = () => {
  const [currentPage, setCurrentPage] = useState('personal');
  const [showAddressDetails, setShowAddressDetails] = useState(false);

  // Experience state
  const [experiences, setExperiences] = useState([
    {
      id: 1,
      employer: '',
      jobTitle: '',
      city: '',
      state: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: ''
    }
  ]);
  const [currentExperienceIndex, setCurrentExperienceIndex] = useState(0);

  // Education state
  const [educations, setEducations] = useState([
    {
      id: 1,
      schoolName: '',
      degree: '',
      fieldOfStudy: '',
      graduation: '',
      city: '',
      state: '',
      startDate: '',
      endDate: '',
      isCurrent: false
    }
  ]);
  const [currentEducationIndex, setCurrentEducationIndex] = useState(0);

  // Skills state
  const [skills, setSkills] = useState([
    {
      id: 1,
      skillName: '',
      proficiency: '',
      yearsOfExperience: '',
      description: ''
    }
  ]);
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);

  // Achievements state
  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: '',
      organization: '',
      dateReceived: '',
      category: '',
      description: '',
      website: ''
    }
  ]);
  const [currentAchievementIndex, setCurrentAchievementIndex] = useState(0);

  // References state
  const [references, setReferences] = useState([
    {
      id: 1,
      firstName: '',
      lastName: '',
      jobTitle: '',
      company: '',
      email: '',
      phone: '',
      relationship: '',
      description: '',
      canContact: false
    }
  ]);
  const [currentReferenceIndex, setCurrentReferenceIndex] = useState(0);

  // Hobbies state
  const [hobbies, setHobbies] = useState([
    {
      id: 1,
      hobbyName: '',
      experienceLevel: '',
      yearsInvolved: '',
      category: '',
      description: '',
      achievements: ''
    }
  ]);
  const [currentHobbyIndex, setCurrentHobbyIndex] = useState(0);

  // Additional Info state
  const [additionalInfos, setAdditionalInfos] = useState([
    {
      id: 1,
      title: '',
      content: ''
    }
  ]);
  const [currentAdditionalInfoIndex, setCurrentAdditionalInfoIndex] = useState(0);

  // Navigation functions
  const handleNextPage = () => {
    if (currentPage === 'personal') {
      setCurrentPage('experience');
    } else if (currentPage === 'experience') {
      setCurrentPage('education');
    } else if (currentPage === 'education') {
      setCurrentPage('skills');
    } else if (currentPage === 'skills') {
      setCurrentPage('achievements');
    } else if (currentPage === 'achievements') {
      setCurrentPage('references');
    } else if (currentPage === 'references') {
      setCurrentPage('hobbies');
    } else if (currentPage === 'hobbies') {
      setCurrentPage('additional');
    }
  };

  const handlePrevPage = () => {
    if (currentPage === 'experience') {
      setCurrentPage('personal');
    } else if (currentPage === 'education') {
      setCurrentPage('experience');
    } else if (currentPage === 'skills') {
      setCurrentPage('education');
    } else if (currentPage === 'achievements') {
      setCurrentPage('skills');
    } else if (currentPage === 'references') {
      setCurrentPage('achievements');
    } else if (currentPage === 'hobbies') {
      setCurrentPage('references');
    } else if (currentPage === 'additional') {
      setCurrentPage('hobbies');
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

  // Achievements functions
  const addNewAchievement = () => {
    const newAchievement = {
      id: achievements.length + 1,
      title: '',
      organization: '',
      dateReceived: '',
      category: '',
      description: '',
      website: ''
    };
    setAchievements([...achievements, newAchievement]);
    setCurrentAchievementIndex(achievements.length);
  };

  const removeAchievement = (index) => {
    if (achievements.length > 1) {
      const newAchievements = achievements.filter((_, i) => i !== index);
      setAchievements(newAchievements);
      setCurrentAchievementIndex(Math.max(0, index - 1));
    }
  };

  const updateAchievement = (field, value) => {
    const updatedAchievements = [...achievements];
    updatedAchievements[currentAchievementIndex] = {
      ...updatedAchievements[currentAchievementIndex],
      [field]: value
    };
    setAchievements(updatedAchievements);
  };

  // References functions
  const addNewReference = () => {
    const newReference = {
      id: references.length + 1,
      firstName: '',
      lastName: '',
      jobTitle: '',
      company: '',
      email: '',
      phone: '',
      relationship: '',
      description: '',
      canContact: false
    };
    setReferences([...references, newReference]);
    setCurrentReferenceIndex(references.length);
  };

  const removeReference = (index) => {
    if (references.length > 1) {
      const newReferences = references.filter((_, i) => i !== index);
      setReferences(newReferences);
      setCurrentReferenceIndex(Math.max(0, index - 1));
    }
  };

  const updateReference = (field, value) => {
    const updatedReferences = [...references];
    updatedReferences[currentReferenceIndex] = {
      ...updatedReferences[currentReferenceIndex],
      [field]: value
    };
    setReferences(updatedReferences);
  };

  // Hobbies functions
  const addNewHobby = () => {
    const newHobby = {
      id: hobbies.length + 1,
      hobbyName: '',
      experienceLevel: '',
      yearsInvolved: '',
      category: '',
      description: '',
      achievements: ''
    };
    setHobbies([...hobbies, newHobby]);
    setCurrentHobbyIndex(hobbies.length);
  };

  const removeHobby = (index) => {
    if (hobbies.length > 1) {
      const newHobbies = hobbies.filter((_, i) => i !== index);
      setHobbies(newHobbies);
      setCurrentHobbyIndex(Math.max(0, index - 1));
    }
  };

  const updateHobby = (field, value) => {
    const updatedHobbies = [...hobbies];
    updatedHobbies[currentHobbyIndex] = {
      ...updatedHobbies[currentHobbyIndex],
      [field]: value
    };
    setHobbies(updatedHobbies);
  };

  // Additional Info functions
  const addNewAdditionalInfo = () => {
    const newAdditionalInfo = {
      id: additionalInfos.length + 1,
      title: '',
      content: ''
    };
    setAdditionalInfos([...additionalInfos, newAdditionalInfo]);
    setCurrentAdditionalInfoIndex(additionalInfos.length);
  };

  const removeAdditionalInfo = (index) => {
    if (additionalInfos.length > 1) {
      const newAdditionalInfos = additionalInfos.filter((_, i) => i !== index);
      setAdditionalInfos(newAdditionalInfos);
      setCurrentAdditionalInfoIndex(Math.max(0, index - 1));
    }
  };

  const updateAdditionalInfo = (field, value) => {
    const updatedAdditionalInfos = [...additionalInfos];
    updatedAdditionalInfos[currentAdditionalInfoIndex] = {
      ...updatedAdditionalInfos[currentAdditionalInfoIndex],
      [field]: value
    };
    setAdditionalInfos(updatedAdditionalInfos);
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
      case 'achievements':
        return (
          <Achievements
            achievements={achievements}
            currentAchievementIndex={currentAchievementIndex}
            setCurrentAchievementIndex={setCurrentAchievementIndex}
            updateAchievement={updateAchievement}
            addNewAchievement={addNewAchievement}
            removeAchievement={removeAchievement}
          />
        );
      case 'references':
        return (
          <References
            references={references}
            currentReferenceIndex={currentReferenceIndex}
            setCurrentReferenceIndex={setCurrentReferenceIndex}
            updateReference={updateReference}
            addNewReference={addNewReference}
            removeReference={removeReference}
          />
        );
      case 'hobbies':
        return (
          <Hobbies
            hobbies={hobbies}
            currentHobbyIndex={currentHobbyIndex}
            setCurrentHobbyIndex={setCurrentHobbyIndex}
            updateHobby={updateHobby}
            addNewHobby={addNewHobby}
            removeHobby={removeHobby}
          />
        );
      case 'additional':
        return (
          <AdditionalInfo
            additionalInfos={additionalInfos}
            currentAdditionalInfoIndex={currentAdditionalInfoIndex}
            setCurrentAdditionalInfoIndex={setCurrentAdditionalInfoIndex}
            updateAdditionalInfo={updateAdditionalInfo}
            addNewAdditionalInfo={addNewAdditionalInfo}
            removeAdditionalInfo={removeAdditionalInfo}
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
            {currentPage === 'achievements' && (
              <div className="page-image">
                <img
                  src="/Achievements.png"
                  alt="Achievements"
                  className="page-img"
                />
              </div>
            )}
            {currentPage === 'references' && (
              <div className="page-image">
                <img
                  src="/References.png"
                  alt="References"
                  className="page-img"
                />
              </div>
            )}
            {currentPage === 'hobbies' && (
              <div className="page-image">
                <img
                  src="/Hobbies.png"
                  alt="Hobbies"
                  className="page-img"
                />
              </div>
            )}
            {currentPage === 'additional' && (
              <div className="page-image">
                <img
                  src="/Additional.png"
                  alt="Additional Information"
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
        {(currentPage === 'experience' || currentPage === 'education' || currentPage === 'skills' || currentPage === 'achievements' || currentPage === 'references' || currentPage === 'hobbies' || currentPage === 'additional') && (
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
          <button className="nav-button next-button" onClick={handleNextPage}>
            Next
          </button>
        )}
        {currentPage === 'achievements' && (
          <button className="nav-button next-button" onClick={handleNextPage}>
            Next
          </button>
        )}
        {currentPage === 'references' && (
          <button className="nav-button next-button" onClick={handleNextPage}>
            Next
          </button>
        )}
        {currentPage === 'hobbies' && (
          <button className="nav-button next-button" onClick={handleNextPage}>
            Next
          </button>
        )}
        {currentPage === 'additional' && (
          <Link to="/dashboard">
            <button className="nav-button submit-nav-button">
              Submit
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;