import React from "react";
import NavButtons from "./NavButtons";

const QuestionBox = ({
  // NEW (all optional)
  actionLabel,
  onAction,
  actionDisabled = false,
  actionTitle,       // handler for "Create" (new resume)

  // questions within the *current entry* of the section
  questions,
  current,
  setCurrent,
  answers,
  onAnswerChange,

  // repeatable controls (wired from parent)
  onAddEntry,
  onRemoveEntry,
  canAdd,
  canRemove,

  // NEW: entry navigation for repeatable sections
  sectionLabel,
  entryIndex,      // 0-based
  entryCount,      // total entries in this section
  onPrevEntry,     // go to previous entry
  onNextEntry,     // go to next entry
  canPrevEntry,
  canNextEntry,

  // cross-section behavior (unchanged)
  hasNextSection,
  hasPrevSection,
  onSectionNext,
  onSectionPrev,
}) => {
  const handleChange = (e) => onAnswerChange(e.target.value);

  // question-level prev/next
  const goPrev = () => {
    if (current > 0) setCurrent((c) => c - 1);
    else if (hasPrevSection && onSectionPrev) onSectionPrev();
  };
  const goNext = () => {
    if (current < questions.length - 1) setCurrent((c) => c + 1);
    else if (hasNextSection && onSectionNext) onSectionNext();
  };

  const disablePrev = current === 0 && !hasPrevSection;
  const disableNext = current === questions.length - 1 && !hasNextSection;

  return (
    <>
      {/* small entry switcher only when section is repeatable */}
      {entryCount > 1 && (
        <div className="entry-switcher">
          <strong className="entry-title">{sectionLabel}</strong>
          <span className="entry-count">#{entryIndex + 1} / {entryCount}</span>

          <div className="entry-controls">
            <button
              className="entry-nav-btn"
              onClick={onPrevEntry}
              disabled={!canPrevEntry}
              aria-label="Previous item"
            >
              ‹
            </button>
            <button
              className="entry-nav-btn"
              onClick={onNextEntry}
              disabled={!canNextEntry}
              aria-label="Next item"
            >
              ›
            </button>
          </div>
        </div>
      )}

      <div className="question-box">
        <label htmlFor="question">{questions[current]}</label>
        <textarea id="question" value={answers[current] || ""} onChange={handleChange} />
      </div>

      <NavButtons
        onPrev={goPrev}
        onNext={goNext}
        onAdd={onAddEntry}
        onRemove={onRemoveEntry}
        disablePrev={disablePrev}
        disableNext={disableNext}
        disableAdd={!canAdd}
        disableRemove={!canRemove}
        actionLabel={actionLabel}
        onAction={onAction}
        actionDisabled={actionDisabled}
        actionTitle={actionTitle}
      />
    </>
  );
};

export default QuestionBox;
