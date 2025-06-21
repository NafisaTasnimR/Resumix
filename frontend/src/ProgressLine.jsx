import React from "react";

const ProgressLine = ({ questions, current, open }) => (
  <div className={`progress-line${open ? " active" : ""}`} id="progressLineDropdown">
    {questions.map((q, idx) => (
      <React.Fragment key={idx}>
        {idx !== 0 && <span>--</span>}
        <div className={`circle${current === idx ? " active" : ""}`}>{idx + 1}</div>
      </React.Fragment>
    ))}
  </div>
);

export default ProgressLine;