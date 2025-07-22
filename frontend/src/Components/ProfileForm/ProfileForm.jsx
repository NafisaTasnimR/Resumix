import React, { useState, useEffect } from 'react';
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
import axios from 'axios';
import TopBar from '../ResumeEditorPage/TopBar';
import { useNavigate } from 'react-router-dom';


const ProfileForm = () => {
  window.scrollTo(0, 0);
  const [currentPage, setCurrentPage] = useState('personal');
  const [showAddressDetails, setShowAddressDetails] = useState(false);
  const navigate = useNavigate();

  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    professionalEmail: '',
    dateOfBirth: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    country: '',
    zipCode: ''
  });

  // Experience state
  const [experiences, setExperiences] = useState([
    {
      id: 1,
      employerName: '',
      jobTitle: '',
      city: '',
      state: '',
      startDate: '',
      endDate: '',
      isCurrentJob: false,
      description: ''
    }
  ]);
  const [currentExperienceIndex, setCurrentExperienceIndex] = useState(0);

  // Education state
  const [educations, setEducations] = useState([
    {
      id: 1,
      institution: '',
      degree: '',
      fieldOfStudy: '',
      graduationDate: '',
      city: '',
      state: '',
      startDate: '',
      endDate: '',
      isCurrentInstitution: false
    }
  ]);
  const [currentEducationIndex, setCurrentEducationIndex] = useState(0);


  const [skills, setSkills] = useState([
    {
      id: 1,
      skillName: '',
      proficiencyLevel: '',
      yearsOfExperience: '',
      skillDescription: ''
    }
  ]);
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);

  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: '',
      organization: '',
      dateReceived: '',
      category: '',
      customCategory: '',
      description: '',
      website: ''
    }
  ]);
  const [currentAchievementIndex, setCurrentAchievementIndex] = useState(0);

  const [references, setReferences] = useState([
    {
      id: 1,
      firstName: '',
      lastName: '',
      jobTitle: '',
      company: '',
      referenceEmail: '',
      phone: '',
      relationship: '',
      customRelationship: '',
      description: '',
      permissionToContact: false
    }
  ]);
  const [currentReferenceIndex, setCurrentReferenceIndex] = useState(0);


  const [hobbies, setHobbies] = useState([
    {
      id: 1,
      hobbyName: '',
      experienceLevel: '',
      yearsInvolved: '',
      category: '',
      hobbyDescription: '',
      achievements: ''
    }
  ]);
  const [currentHobbyIndex, setCurrentHobbyIndex] = useState(0);


  const [additionalInfos, setAdditionalInfos] = useState([
    {
      id: 1,
      sectionTitle: '',
      content: ''
    }
  ]);
  const [currentAdditionalInfoIndex, setCurrentAdditionalInfoIndex] = useState(0);


  const handleNextPage = () => {
    window.scrollTo(0, 0);
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
    window.scrollTo(0, 0);
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
    window.scrollTo(0, 0);
    alert('Resume submitted successfully!');
  };

  // Experience functions
  const addNewExperience = () => {
    const newExperience = {
      id: experiences.length + 1,
      employerName: '',
      jobTitle: '',
      city: '',
      state: '',
      startDate: '',
      endDate: '',
      isCurrentJob: false,
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
      institution: '',
      degree: '',
      fieldOfStudy: '',
      graduationDate: '',
      city: '',
      state: '',
      startDate: '',
      endDate: '',
      isCurrentInstitution: false
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
      proficiencyLevel: '',
      yearsOfExperience: '',
      skillDescription: ''
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
      customCategory: '',
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
      referenceEmail: '',
      phone: '',
      relationship: '',
      customRelationship: '',
      description: '',
      permissionToContact: false
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
      hobbyDescription: '',
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
      sectionTitle: '',
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
            personalInfo={personalInfo}
            setPersonalInfo={setPersonalInfo}
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

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("No token found, please log in again.");
        return;
      }

      const payload = {
        defaultResumeData: {
          personalInfo: {
            ...personalInfo,
            dateOfBirth: personalInfo.dateOfBirth ? new Date(personalInfo.dateOfBirth) : null
          },
          education: educations.map(e => ({
            ...e,
            startDate: e.startDate ? new Date(e.startDate) : null,
            endDate: e.endDate ? new Date(e.endDate) : null,
            graduationDate: e.graduationDate ? new Date(e.graduationDate) : null
          })),
          experience: experiences.map(e => ({
            ...e,
            startDate: e.startDate ? new Date(e.startDate) : null,
            endDate: e.endDate ? new Date(e.endDate) : null
          })),
          skills,
          achievements: achievements.map(a => ({
            ...a,
            dateReceived: a.dateReceived ? new Date(a.dateReceived) : null
          })),
          references,
          hobbies: hobbies.map(h => ({
            hobbyName: h.hobbyName,
            experienceLevel: h.experienceLevel,
            yearsInvolved: h.yearsInvolved,
            category: h.category,
            hobbyDescription: h.hobbyDescription,
            achievementsRecognition: h.achievements,
            permissionToContact: h.permissionToContact || false
          })),
          additionalInfos
        }
      };


      const response = await axios.patch(
        'http://localhost:5000/info/update',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      navigate('/dashboard');

      alert("Profile updated successfully!");
      console.log(response.data);

    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.errors) {
        alert("Validation errors: " + error.response.data.errors.join(", "));
      } else {
        alert("Failed to update profile. Please try again.");
      }
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await new Promise((res) => setTimeout(res, 1000));
        const response = await axios.get('http://localhost:5000/viewInformation/userInformation', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const resume = response?.data?.defaultResumeData;

        if (!resume) {
          console.error("No resume data found for the user.");
          return
        };

        const formatDate = (date) => {
          if (!date) return '';
          const d = new Date(date);
          return !isNaN(d) ? d.toISOString().substring(0, 10) : '';
        };

        if (resume.personalInfo) {
          setPersonalInfo({
            fullName: resume.personalInfo.fullName || '',
            professionalEmail: resume.personalInfo.professionalEmail || '',
            dateOfBirth: formatDate(resume.personalInfo.dateOfBirth),
            phone: resume.personalInfo.phone || '',
            address: resume.personalInfo.address || '',
            city: resume.personalInfo.city || '',
            district: resume.personalInfo.district || '',
            country: resume.personalInfo.country || '',
            zipCode: resume.personalInfo.zipCode || ''
          });
        }

        if (Array.isArray(resume.education) && resume.education.length > 0) {
          setEducations(
            resume.education.map((edu) => ({
              ...edu,
              graduationDate: formatDate(edu.graduationDate),
              startDate: formatDate(edu.startDate),
              endDate: formatDate(edu.endDate),
            }))
          );
        }

        if (Array.isArray(resume.experience) && resume.experience.length > 0) {
          setExperiences(
            resume.experience.map((exp) => ({
              ...exp,
              startDate: formatDate(exp.startDate),
              endDate: formatDate(exp.endDate),
            }))
          );
        }

        if (Array.isArray(resume.skills)) {
          setSkills(resume.skills);
        }

        if (Array.isArray(resume.achievements)) {
          setAchievements(
            resume.achievements.map((a) => ({
              ...a,
              dateReceived: formatDate(a.dateReceived),
            }))
          );
        }

        if (Array.isArray(resume.references)) {
          setReferences(resume.references);
        }

        if (Array.isArray(resume.hobbies)) {
          setHobbies(resume.hobbies);
        }

        if (Array.isArray(resume.additionalInfos)) {
          setAdditionalInfos(
            resume.additionalInfos.map((info) => ({
              sectionTitle: info.sectionTitle || '',
              content: info.content || '',
            }))
          );
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchUserData();
  }, []);


  return (
    <div className="resume-container">

      <div className="resume-header">
        <TopBar />
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
          //<Link to="/dashboard">
          <button className="nav-button submit-nav-button" onClick={handleSave}>
            Submit
          </button>
          //</Link>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;