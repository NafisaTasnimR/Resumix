// ProgressLine.jsx
import React from "react";

const ProgressLine = ({ items, current, open }) => (
  <div className={`progress-line${open ? " active" : ""}`} id="progressLineDropdown">
    {items.map((it, idx) => (
      <React.Fragment key={it.key || idx}>
        {idx !== 0 && <span className="progress-dash">--</span>}
        <div
          className={`circle${current === idx ? " active" : ""}`}
          aria-current={current === idx ? "step" : undefined}
          tabIndex={0}              // keyboard focus shows tooltip too
        >
          {/* Tooltip text */}
          <span className="circle-tip">{it.label || it.key || `Step ${idx + 1}`}</span>

          {/* Icon or number */}
          {it.icon ? (
            <img src={it.icon} alt="" aria-hidden="true" />
          ) : (
            idx + 1
          )}
        </div>
      </React.Fragment>
    ))}
  </div>
);

export default ProgressLine;
