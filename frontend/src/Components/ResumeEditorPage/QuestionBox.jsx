import React, { useState } from "react";
import NavButtons from "./NavButtons";
import ProgressLine from "./ProgressLine";

const QuestionBox = ({
  questions,
  current,
  setCurrent,
  answers,
  onAnswerChange,
}) => {
  const [progressOpen, setProgressOpen] = useState(true);

  const handleChange = (e) => {
    onAnswerChange(e.target.value);
  };

  const goPrev = () => setCurrent((c) => Math.max(0, c - 1));
  const goNext = () => setCurrent((c) => Math.min(questions.length - 1, c + 1));
  const skip = () => goNext();
  const edit = () => {};

  const toggleProgressLine = () => setProgressOpen((open) => !open);

  return (
    <>
      <div className="question-box">
        <label htmlFor="question">{questions[current]}</label>
        <textarea
          id="question"
          value={answers[current]}
          onChange={handleChange}
        />
      </div>
      <div className="progress">
        <div className="progress-line-header" onClick={toggleProgressLine}>
          <span className="progress-title">Progress Line</span>
          <button className="arrow-btn-progress">
            {progressOpen ? "▲" : "▼"}
          </button>
        </div>
        <ProgressLine questions={questions} current={current} open={progressOpen} />
      </div>
      <NavButtons
        onPrev={goPrev}
        onNext={goNext}
        onSkip={skip}
        onEdit={edit}
        disablePrev={current === 0}
        disableNext={current === questions.length - 1}
      />
    </>
  );
};

export default QuestionBox;