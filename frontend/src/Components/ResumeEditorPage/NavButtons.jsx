import React from "react";

const NavButtons = ({
  onPrev,
  onNext,
  onAdd,
  onRemove,
  disablePrev,
  disableNext,
  disableAdd,
  disableRemove,

  // NEW (all optional)
  actionLabel,          // e.g., "Create" or "Save"
  onAction,             // handler
  actionDisabled = false,
  actionTitle,          // tooltip (optional)
}) => (
  <div className="nav-buttons">
    <button onClick={onPrev}   disabled={disablePrev}   aria-label="Previous">&larr;</button>
    <button className="square" onClick={onAdd}    disabled={disableAdd}    aria-label="Add section instance">+</button>
    <button className="square" onClick={onRemove} disabled={disableRemove} aria-label="Remove section instance">−</button>
    <button onClick={onNext}   disabled={disableNext}   aria-label="Next">&rarr;</button>

    {/* NEW: right-side contextual action; uses same button styling */}
    {actionLabel ? (
      <>
        <span style={{ width: 8, display: "inline-block" }} />
        <button
          onClick={onAction}
          disabled={actionDisabled}
          aria-label={actionLabel}
          title={actionTitle || actionLabel}
        >
          {actionDisabled
            ? (actionLabel.toLowerCase().includes("save") ? "Saving…" : "Creating…")
            : actionLabel}
        </button>
      </>
    ) : null}
  </div>
);

export default NavButtons;
