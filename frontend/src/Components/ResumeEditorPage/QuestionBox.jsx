import React from "react";
import NavButtons from "./NavButtons";

const QuestionBox = ({
  questions,
  current,
  setCurrent,
  answers,
  onAnswerChange,
  onSectionNext,   // NEW: ask parent to go to next section
  onSectionPrev,   // NEW: ask parent to go to prev section
  hasNextSection,  // NEW: booleans from parent
  hasPrevSection,  // NEW: booleans from parent
}) => {
  const handleChange = (e) => onAnswerChange(e.target.value);

  const goPrev = () => {
    if (current > 0) setCurrent((c) => c - 1);
    else if (hasPrevSection && onSectionPrev) onSectionPrev();
  };

  const goNext = () => {
    if (current < questions.length - 1) setCurrent((c) => c + 1);
    else if (hasNextSection && onSectionNext) onSectionNext();
  };

  const skip = () => goNext();
  const edit = () => {};

  // disable only when you're at very first question of first section OR
  // very last question of last section
  const disablePrev = current === 0 && !hasPrevSection;
  const disableNext = current === questions.length - 1 && !hasNextSection;

  return (
    <>
      <div className="question-box">
        <label htmlFor="question">{questions[current]}</label>
        <textarea id="question" value={answers[current]} onChange={handleChange} />
      </div>

      <NavButtons
        onPrev={goPrev}
        onNext={goNext}
        onSkip={skip}
        onEdit={edit}
        disablePrev={disablePrev}
        disableNext={disableNext}
      />
    </>
  );
};

export default QuestionBox;
