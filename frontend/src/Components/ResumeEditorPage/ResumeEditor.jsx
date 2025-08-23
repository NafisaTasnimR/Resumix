import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import QuestionBox from './QuestionBox';
import Preview from './Preview';

const FIELD_INDEX = {
  personal: {
    fullName: 0, professionalEmail: 1, dateOfBirth: 2, phone: 3,
    address: 4, city: 5, district: 6, country: 7, zipCode: 8,
  },
  education: {
    degree: 0, fieldOfStudy: 1, institution: 2, startDate: 3, endDate: 4,
    isCurrentEducation: 5, currentStatus: 5 // whichever you store
  },
  experience: {
    jobTitle: 0,
    employerName: 1,
    city: 2, state: 2, location: 2, // map location-ish fields to the same question
    startDate: 3,
    endDate: 4,
    isCurrentJob: 5,
    bullets: 6, responsibilities: 6
  },
  skills: { skillName: 0, proficiencyLevel: 1, yearsOfExperience: 2, description: 3 },
  achievements: { title: 0, organization: 1, dateReceived: 2, category: 3, description: 4, website: 5 },
  references: { firstName: 0, lastName: 0, jobTitle: 1, company: 2, referenceEmail: 3, referencePhone: 4 },
  hobbies: { hobbyName: 0 },
  additional: { content: 0, sectionTitle: 0 }
};

const personalQuestions = [
  "Full Name?",
  "Professional Email?",
  "Date of Birth?",
  "Phone?",
  "Address?",
  "City?",
  "District?",
  "Country?",
  "Zip Code?",
];

const educationQuestions = [
  "Your Degree?",
  "Your Field of Study?",
  "Your Institution?",
  "Start Date of Education?",
  "End Date of Education?",
  "Current Status of Education?",
];

const experienceQuestions = [
  "Job Title?",
  "Employer Name?",
  "Job Location?",
  "Start Date of Job?",
  "End Date of Job?",
  "Is this your current job?",
  "Your Responsibilities?",
];

const skillQuestions = [
  "Skill Name?",
  "Skill Proficiency?",
  "Years of Experience?",
  "Skills Description?",
];

const achievementQuestions = [
  "Achievement Title?",
  "Organization (optional)?",
  "Date Received?",
  "Category (e.g., Award, Certification)?",
  "Description?",
  "Website (optional)?",
];


const referenceQuestions = [
  "Referee Name?",
  "Referee Designation?",
  "Referee Organization?",
  "Referee Email?",
  "Referee Phone?"
];

const hobbyQuestions = [
  "Your Hobbies?"
];

const additionalInfoQuestions = [
  "Additional Information?"
];


const ResumeEditor = () => {
  const [questions, setQuestions] = useState(personalQuestions);
  const location = useLocation();
  const renderedHtml = location.state?.rawTemplate || "";
  const templateCss = location.state?.templateCss || "";
  console.log("Router state:", location.state);


  console.log("Rendered HTML:", renderedHtml);
  const titleFromTemplate = location.state?.templateName || "Untitled";

  const [title, setTitle] = useState(titleFromTemplate);
  const [titleDropdownOpen, setTitleDropdownOpen] = useState(false);

  // Lifted state for answers and current question
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));

  const toggleTitleEdit = () => setTitleDropdownOpen(!titleDropdownOpen);
  const saveTitle = (e) => {
    e.stopPropagation();
    const value = document.getElementById('titleInput').value;
    setTitle(value || 'Untitled');
    setTitleDropdownOpen(false);
  };

  // Handler to update answers
  const handleAnswerChange = (value) => {
    const updated = [...answers];
    updated[current] = value;
    setAnswers(updated);
  };

  const handleSectionClick = (payload) => {
  // support both old string API and new object API
  const section = typeof payload === "string" ? payload : payload?.section;
  const field   = typeof payload === "string" ? undefined : payload?.field;

  // choose the question set for the section
  let qs = personalQuestions;
  switch (section) {
    case "personal":      qs = personalQuestions; break;
    case "education":     qs = educationQuestions; break;
    case "experience":    qs = experienceQuestions; break;
    case "skills":        qs = skillQuestions; break;
    case "achievements":  qs = achievementQuestions; break;
    case "references":    qs = referenceQuestions; break;
    case "hobbies":       qs = hobbyQuestions; break;
    case "additional":    qs = additionalInfoQuestions; break;
    default:              qs = personalQuestions;
  }
  setQuestions(qs);

  // pick the right question index based on field name
  const idxMap = FIELD_INDEX[section] || {};
  const nextIndex =
    field && Object.prototype.hasOwnProperty.call(idxMap, field)
      ? idxMap[field]
      : 0;

  setCurrent(nextIndex);
};

  return (
    <div className='resume-editor'>
      <div className="main">
        <div className="title-edit">
          <div className="title-edit-bar" onClick={toggleTitleEdit}>
            <span className="title-text" id="titleDisplay">{title}</span>
            <button className="arrow-btn">{titleDropdownOpen ? '▲' : '▼'}</button>
          </div>
          {titleDropdownOpen && (
            <div className="title-edit-dropdown active" id="titleDropdown">
              <input type="text" id="titleInput" defaultValue={title} />
              <button className="edit-btn1" onClick={saveTitle}>Edit</button>
            </div>
          )}
        </div>

        <QuestionBox
          questions={questions}
          current={current}
          setCurrent={setCurrent}
          answers={answers}
          //onAnswerChange={handleAnswerChange}
          onAnswerChange={(value) => {
            const updated = [...answers];
            updated[current] = value;
            setAnswers(updated);
          }}
          title={title}
        />
      </div>
      <Preview
        title={title}
        answers={answers}
        renderedHtml={renderedHtml}
        templateCss={templateCss}
        onSectionClick={handleSectionClick}
      />
    </div>
  );
};

export default ResumeEditor;