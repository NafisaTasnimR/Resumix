import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import QuestionBox from './QuestionBox';
import Preview from './Preview';

const questions = [
  "Your Work Experience?",
  "Your Education?",
  "Your Skills?",
  "Your Projects?",
];

const ResumeEditor = () => {
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
      />
    </div>
  );
};

export default ResumeEditor;