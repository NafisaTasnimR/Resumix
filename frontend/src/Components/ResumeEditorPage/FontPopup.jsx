import React from 'react';
import './FontPopup.css';

const fonts = [
  { name: 'Roman', fontFamily: "'Times New Roman', serif" },
  { name: 'Arial', fontFamily: "'Arial', sans-serif" },
  { name: 'Georgia', fontFamily: "'Georgia', serif" },
  { name: 'Courier New', fontFamily: "'Courier New', monospace" },
  { name: 'Verdana', fontFamily: "'Verdana', sans-serif" },
  { name: 'Trebuchet MS', fontFamily: "'Trebuchet MS', sans-serif" },
  { name: 'Tahoma', fontFamily: "'Tahoma', sans-serif" },
  { name: 'Palatino', fontFamily: "'Palatino Linotype', serif" },
];

const Font = ({ onClose, onFontSelect }) => {
  return (
    <div className="font-popup-overlay">
      <div className="font-popup">
        <div className="font-popup-header">
          <h2>Fonts</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="search-section">
          <input type="text" className="font-search" placeholder="search" />
          <button className="search-btn">SI</button>
        </div>

        <div className="font-grid">
          {fonts.map((font, index) => (
            <div
              key={index}
              className="font-card"
              onClick={() => onFontSelect(font.fontFamily)}
            >
              <div className="font-preview" style={{ fontFamily: font.fontFamily }}>
                Hello
              </div>
              <div className="font-name">{font.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Font;
