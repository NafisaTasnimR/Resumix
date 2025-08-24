import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import QuestionBox from './QuestionBox';
import Preview from './Preview';
import ProgressLine from './ProgressLine';

const FIELD_INDEX = {
  personal: { fullName: 0, professionalEmail: 1, dateOfBirth: 2, phone: 3, address: 4, city: 5, district: 6, country: 7, zipCode: 8 },
  education: { degree: 0, fieldOfStudy: 1, institution: 2, startDate: 3, endDate: 4, isCurrentEducation: 5, currentStatus: 5 },
  experience: { jobTitle: 0, employerName: 1, city: 2, state: 2, location: 2, startDate: 3, endDate: 4, isCurrentJob: 5, bullets: 6, responsibilities: 6 },
  skills: { skillName: 0, proficiencyLevel: 1, yearsOfExperience: 2, description: 3 },
  achievements: { title: 0, organization: 1, dateReceived: 2, category: 3, description: 4, website: 5 },
  references: { firstName: 0, lastName: 0, jobTitle: 1, company: 2, referenceEmail: 3, referencePhone: 4 },
  hobbies: { hobbyName: 0 },
  additional: { content: 0, sectionTitle: 0 }
};

const personalQuestions   = ["Full Name?","Professional Email?","Date of Birth?","Phone?","Address?","City?","District?","Country?","Zip Code?"];
const educationQuestions  = ["Your Degree?","Your Field of Study?","Your Institution?","Start Date of Education?","End Date of Education?","Current Status of Education?"];
const experienceQuestions = ["Job Title?","Employer Name?","Job Location?","Start Date of Job?","End Date of Job?","Is this your current job?","Your Responsibilities?"];
const skillQuestions      = ["Skill Name?","Skill Proficiency?","Years of Experience?","Skills Description?"];
const achievementQuestions= ["Achievement Title?","Organization (optional)?","Date Received?","Category (e.g., Award, Certification)?","Description?","Website (optional)?"];
const referenceQuestions  = ["Referee Name?","Referee Designation?","Referee Organization?","Referee Email?","Referee Phone?"];
const hobbyQuestions      = ["Your Hobbies?"];
const additionalInfoQuestions = ["Additional Information?"];

const SECTION_LIST = [
  { key: "personal",     label: "Personal",     qs: personalQuestions },
  { key: "education",    label: "Education",    qs: educationQuestions },
  { key: "experience",   label: "Experience",   qs: experienceQuestions },
  { key: "skills",       label: "Skills",       qs: skillQuestions },
  { key: "achievements", label: "Achievements", qs: achievementQuestions },
  { key: "references",   label: "References",   qs: referenceQuestions },
  { key: "hobbies",      label: "Hobbies",      qs: hobbyQuestions },
  { key: "additional",   label: "Additional",   qs: additionalInfoQuestions },
];

const ResumeEditor = () => {
  const location = useLocation();
  const renderedHtml = location.state?.rawTemplate || "";
  const templateCss  = location.state?.templateCss || "";
  const titleFromTemplate = location.state?.templateName || "Untitled";

  const [title, setTitle] = useState(titleFromTemplate);
  const [titleDropdownOpen, setTitleDropdownOpen] = useState(false);

  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const currentSection = SECTION_LIST[currentSectionIdx];

  const [answersBySection, setAnswersBySection] = useState(() => ({
    personal:     Array(personalQuestions.length).fill(""),
    education:    Array(educationQuestions.length).fill(""),
    experience:   Array(experienceQuestions.length).fill(""),
    skills:       Array(skillQuestions.length).fill(""),
    achievements: Array(achievementQuestions.length).fill(""),
    references:   Array(referenceQuestions.length).fill(""),
    hobbies:      Array(hobbyQuestions.length).fill(""),
    additional:   Array(additionalInfoQuestions.length).fill(""),
  }));

  const toggleTitleEdit = () => setTitleDropdownOpen(!titleDropdownOpen);
  const saveTitle = (e) => {
    e.stopPropagation();
    const value = document.getElementById('titleInput').value;
    setTitle(value || 'Untitled');
    setTitleDropdownOpen(false);
  };

  // Move to a specific section/field (from clicking the preview)
  const handleSectionClick = (payload) => {
    const sectionKey = typeof payload === "string" ? payload : payload?.section;
    const field      = typeof payload === "string" ? undefined : payload?.field;

    const idx = SECTION_LIST.findIndex(s => s.key === sectionKey);
    const safeIdx = idx >= 0 ? idx : 0;

    setCurrentSectionIdx(safeIdx);

    const idxMap = FIELD_INDEX[sectionKey] || {};
    const nextQ = (field && Object.prototype.hasOwnProperty.call(idxMap, field)) ? idxMap[field] : 0;
    setCurrentQuestionIdx(nextQ);
  };

  // Update an answer in the current section
  const handleAnswerChange = (value) => {
    const secKey = currentSection.key;
    setAnswersBySection(prev => {
      const copy = { ...prev };
      const arr  = [...copy[secKey]];
      arr[currentQuestionIdx] = value;
      copy[secKey] = arr;
      return copy;
    });
  };

  // Cross-section navigation (called by QuestionBox at edges)
  const goToNextSection = () => {
    if (currentSectionIdx < SECTION_LIST.length - 1) {
      setCurrentSectionIdx(i => i + 1);
      setCurrentQuestionIdx(0); // progress line will move now
    }
  };

  const goToPrevSection = () => {
    if (currentSectionIdx > 0) {
      setCurrentSectionIdx(i => i - 1);
      const prevIdx = currentSectionIdx - 1;
      const lastQ = SECTION_LIST[Math.max(prevIdx, 0)].qs.length - 1;
      setCurrentQuestionIdx(Math.max(lastQ, 0));
    }
  };

  // collapsible state for the single progress line
  const [progressOpen, setProgressOpen] = useState(true);

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

        {/* The ONLY progress line (sections-based) */}
        <div className="progress">
          <div className="progress-line-header" onClick={() => setProgressOpen(v => !v)}>
            <span className="progress-title">Progress Line</span>
            <button className="arrow-btn-progress">{progressOpen ? "▲" : "▼"}</button>
          </div>
          <ProgressLine items={SECTION_LIST} current={currentSectionIdx} open={progressOpen} />
        </div>

        {/* Questions within the active section */}
        <QuestionBox
          questions={currentSection.qs}
          current={currentQuestionIdx}
          setCurrent={setCurrentQuestionIdx}
          answers={answersBySection[currentSection.key]}
          onAnswerChange={handleAnswerChange}
          onSectionNext={goToNextSection}
          onSectionPrev={goToPrevSection}
          hasNextSection={currentSectionIdx < SECTION_LIST.length - 1}
          hasPrevSection={currentSectionIdx > 0}
        />
      </div>

      <Preview
        title={title}
        answers={answersBySection}
        renderedHtml={renderedHtml}
        templateCss={templateCss}
        onSectionClick={handleSectionClick}
      />
    </div>
  );
};

export default ResumeEditor;
