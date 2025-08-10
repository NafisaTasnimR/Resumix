import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import QuestionBox from './QuestionBox';
import Preview from './Preview';

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

  const handleSectionClick = (section) => {
  switch (section) {
    case "personal":
      setQuestions(personalQuestions);
      break;
    case "education":
      setQuestions(educationQuestions);
      break;
    case "experience":
      setQuestions(experienceQuestions);
      break;
    case "skills":
      setQuestions(skillQuestions);
      break;
    case "achievements":
      setQuestions(achievementQuestions);
      break;
    case "references":
      setQuestions(referenceQuestions);
      break;
    case "hobbies":
      setQuestions(hobbyQuestions);
      break;
    case "additional":
      setQuestions(additionalInfoQuestions);
      break;
    default:
      break;
  }
  setCurrent(0); 
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