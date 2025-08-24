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
}) => (
  <div className="nav-buttons">
    <button onClick={onPrev}   disabled={disablePrev}   aria-label="Previous">&larr;</button>
    <button className= "square" onClick={onAdd}    disabled={disableAdd}    aria-label="Add section instance">+</button>
    <button className= "square" onClick={onRemove} disabled={disableRemove} aria-label="Remove section instance">−</button>
    <button onClick={onNext}   disabled={disableNext}   aria-label="Next">&rarr;</button>
  </div>
);

export default NavButtons;