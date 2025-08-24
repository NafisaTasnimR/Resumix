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

const personalQuestions = ["Full Name?", "Professional Email?", "Date of Birth?", "Phone?", "Address?", "City?", "District?", "Country?", "Zip Code?"];
const educationQuestions = ["Your Degree?", "Your Field of Study?", "Your Institution?", "Start Date of Education?", "End Date of Education?", "Current Status of Education?"];
const experienceQuestions = ["Job Title?", "Employer Name?", "Job Location?", "Start Date of Job?", "End Date of Job?", "Is this your current job?", "Your Responsibilities?"];
const skillQuestions = ["Skill Name?", "Skill Proficiency?", "Years of Experience?", "Skills Description?"];
const achievementQuestions = ["Achievement Title?", "Organization (optional)?", "Date Received?", "Category (e.g., Award, Certification)?", "Description?", "Website (optional)?"];
const referenceQuestions = ["Referee Name?", "Referee Designation?", "Referee Organization?", "Referee Email?", "Referee Phone?"];
const hobbyQuestions = ["Your Hobbies?"];
const additionalInfoQuestions = ["Additional Information?"];

const SECTION_LIST = [
  { key: "personal", label: "Personal", repeatable: false, qs: personalQuestions },
  { key: "education", label: "Education", repeatable: true, qs: educationQuestions },
  { key: "experience", label: "Experience", repeatable: true, qs: experienceQuestions },
  { key: "skills", label: "Skills", repeatable: true, qs: skillQuestions },
  { key: "achievements", label: "Achievements", repeatable: true, qs: achievementQuestions },
  { key: "references", label: "References", repeatable: true, qs: referenceQuestions },
  { key: "hobbies", label: "Hobbies", repeatable: true, qs: hobbyQuestions },
  { key: "additional", label: "Additional", repeatable: true, qs: additionalInfoQuestions },
];

const initEntry = (qs) => Array(qs.length).fill("");

const makeInitialEntries = () => ({
  personal: [initEntry(personalQuestions)],
  education: [initEntry(educationQuestions)],
  experience: [initEntry(experienceQuestions)],
  skills: [initEntry(skillQuestions)],
  achievements: [initEntry(achievementQuestions)],
  references: [initEntry(referenceQuestions)],
  hobbies: [initEntry(hobbyQuestions)],
  additional: [initEntry(additionalInfoQuestions)],
});

const makeInitialEntryIdx = () => ({
  personal: 0, education: 0, experience: 0, skills: 0,
  achievements: 0, references: 0, hobbies: 0, additional: 0,
});

const ResumeEditor = () => {
  const location = useLocation();
  const renderedHtml = location.state?.rawTemplate || "";
  const templateCss = location.state?.templateCss || "";
  const titleFromTemplate = location.state?.templateName || "Untitled";

  const [title, setTitle] = useState(titleFromTemplate);
  const [titleDropdownOpen, setTitleDropdownOpen] = useState(false);

  // which section & question are active
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

  // per-section, multi-entry answers
  const [entriesBySection, setEntriesBySection] = useState(makeInitialEntries);
  const [entryIndexBySection, setEntryIndexBySection] = useState(makeInitialEntryIdx);

  const currentSection = SECTION_LIST[currentSectionIdx];
  const currKey = currentSection.key;
  const currEntries = entriesBySection[currKey];
  const currEntryIdx = entryIndexBySection[currKey];
  const currAnswers = currEntries[currEntryIdx];
  const [progressOpen, setProgressOpen] = useState(true);

  const toggleTitleEdit = () => setTitleDropdownOpen(!titleDropdownOpen);
  const saveTitle = (e) => {
    e.stopPropagation();
    const value = document.getElementById('titleInput').value;
    setTitle(value || 'Untitled');
    setTitleDropdownOpen(false);
  };

  // jump from preview to a section/field
  const handleSectionClick = (payload) => {
    const sectionKey = typeof payload === "string" ? payload : payload?.section;
    const field = typeof payload === "string" ? undefined : payload?.field;

    const idx = SECTION_LIST.findIndex(s => s.key === sectionKey);
    const safeIdx = idx >= 0 ? idx : 0;
    setCurrentSectionIdx(safeIdx);

    const idxMap = FIELD_INDEX[sectionKey] || {};
    const nextQ = (field && Object.prototype.hasOwnProperty.call(idxMap, field)) ? idxMap[field] : 0;
    setCurrentQuestionIdx(nextQ);
    // keep current entry index for that section
  };

  // update one answer in current entry of current section
  const handleAnswerChange = (value) => {
    setEntriesBySection(prev => {
      const copy = { ...prev };
      const list = copy[currKey].map(arr => [...arr]); // clone
      list[currEntryIdx][currentQuestionIdx] = value;
      copy[currKey] = list;
      return copy;
    });
  };

  // cross-section navigation
  const onSectionNext = () => {
    if (currentSectionIdx < SECTION_LIST.length - 1) {
      setCurrentSectionIdx(i => i + 1);
      setCurrentQuestionIdx(0);
    }
  };
  const onSectionPrev = () => {
    if (currentSectionIdx > 0) {
      const prevIdx = currentSectionIdx - 1;
      setCurrentSectionIdx(prevIdx);
      const lastQ = SECTION_LIST[prevIdx].qs.length - 1;
      setCurrentQuestionIdx(Math.max(lastQ, 0));
    }
  };

  // add another instance of the current section
  const onAddEntry = () => {
    if (!currentSection.repeatable) return;
    setEntriesBySection(prev => {
      const copy = { ...prev };
      const newEntry = initEntry(currentSection.qs);
      copy[currKey] = [...copy[currKey], newEntry];
      return copy;
    });
    setEntryIndexBySection(prev => ({ ...prev, [currKey]: currEntries.length })); // go to new one
    setCurrentQuestionIdx(0);
  };

  // remove current instance (or clear if only one)
  const onRemoveEntry = () => {
    if (!currentSection.repeatable) return;
    const total = currEntries.length;
    if (total > 1) {
      setEntriesBySection(prev => {
        const copy = { ...prev };
        const newList = [...copy[currKey]];
        newList.splice(currEntryIdx, 1);
        copy[currKey] = newList;
        return copy;
      });
      setEntryIndexBySection(prev => ({ ...prev, [currKey]: Math.max(0, currEntryIdx - 1) }));
      setCurrentQuestionIdx(0);
    } else {
      setEntriesBySection(prev => {
        const copy = { ...prev };
        copy[currKey] = [initEntry(currentSection.qs)];
        return copy;
      });
      setCurrentQuestionIdx(0);
    }
  };

  // NEW: entry pager handlers + booleans
  const onPrevEntry = () => {
    if (!currentSection.repeatable) return;
    if (currEntryIdx > 0) {
      setEntryIndexBySection(prev => ({ ...prev, [currKey]: currEntryIdx - 1 }));
      setCurrentQuestionIdx(0);
    }
  };
  const onNextEntry = () => {
    if (!currentSection.repeatable) return;
    if (currEntryIdx < currEntries.length - 1) {
      setEntryIndexBySection(prev => ({ ...prev, [currKey]: currEntryIdx + 1 }));
      setCurrentQuestionIdx(0);
    }
  };
  const canPrevEntry = currentSection.repeatable && currEntries.length > 1 && currEntryIdx > 0;
  const canNextEntry = currentSection.repeatable && currEntries.length > 1 && currEntryIdx < currEntries.length - 1;

  // button enable/disable
  const hasNextSection = currentSectionIdx < SECTION_LIST.length - 1;
  const hasPrevSection = currentSectionIdx > 0;
  const canAdd = !!currentSection.repeatable;
  const canRemove = !!currentSection.repeatable && currEntries.length >= 1;

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

        {/* single, section-based progress line */}
        <div className="progress">
          <div
            className="progress-line-header"
            onClick={() => setProgressOpen((o) => !o)}
          >
            <span className="progress-title">Progress Line</span>
            <button className="arrow-btn-progress">
              {progressOpen ? "▲" : "▼"}
            </button>
          </div>

          <ProgressLine
            items={SECTION_LIST}
            current={currentSectionIdx}
            open={progressOpen}
          />
        </div>

        {/* Questions for CURRENT ENTRY of CURRENT SECTION */}
        <QuestionBox
          questions={currentSection.qs}
          current={currentQuestionIdx}
          setCurrent={setCurrentQuestionIdx}
          answers={currAnswers}
          onAnswerChange={handleAnswerChange}

          // repeatable controls
          onAddEntry={onAddEntry}
          onRemoveEntry={onRemoveEntry}
          canAdd={canAdd}
          canRemove={canRemove}

          // NEW: entry pager props
          sectionLabel={currentSection.label}
          entryIndex={currEntryIdx}
          entryCount={currEntries.length}
          onPrevEntry={onPrevEntry}
          onNextEntry={onNextEntry}
          canPrevEntry={canPrevEntry}
          canNextEntry={canNextEntry}

          // cross-section behavior
          hasNextSection={hasNextSection}
          hasPrevSection={hasPrevSection}
          onSectionNext={onSectionNext}
          onSectionPrev={onSectionPrev}
        />
      </div>

      <Preview
        title={title}
        answers={entriesBySection}   // NOTE: now per-section *arrays of entries*
        renderedHtml={renderedHtml}
        templateCss={templateCss}
        onSectionClick={handleSectionClick}
      />
    </div>
  );
};

export default ResumeEditor;
