import React from "react";

const ProgressLine = ({ items, current, open }) => (
  <div className={`progress-line${open ? " active" : ""}`} id="progressLineDropdown">
    {items.map((it, idx) => (
      <React.Fragment key={it.key || idx}>
        {idx !== 0 && <span>--</span>}
        <div className={`circle${current === idx ? " active" : ""}`}>{idx + 1}</div>
      </React.Fragment>
    ))}
  </div>
);

export default ProgressLine;