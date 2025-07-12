import React from "react";

const NavButtons = ({ onPrev, onNext, onSkip, onEdit, disablePrev, disableNext }) => (
  <div className="nav-buttons">
    <button onClick={onPrev} disabled={disablePrev}>&larr;</button>
    <button onClick={onEdit}>Edit</button>
    <button onClick={onSkip}>Skip</button>
    <button onClick={onNext} disabled={disableNext}>&rarr;</button>
  </div>
);

export default NavButtons;