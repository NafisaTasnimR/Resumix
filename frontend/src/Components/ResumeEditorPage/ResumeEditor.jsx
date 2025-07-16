import React, { useState } from 'react';
import QuestionBox from './QuestionBox';
import Preview from './Preview';

const questions = [
  "Your Work Experience?",
  "Your Education?",
  "Your Skills?",
  "Your Projects?",
];

const ResumeEditor = () => {
  const [title, setTitle] = useState('Untitled');
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
          onAnswerChange={handleAnswerChange}
          title={title}
        />
      </div>
      <Preview
        title={title}
        answers={answers}
      />
    </div>
  );
};

export default ResumeEditor;