import './ResumeEditorPage.css';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import ResumeEditor from './ResumeEditor';
import FontPopup from './FontPopup';
import ColorPaletteModal from './ColorPaletteModal';
import React, { useState } from 'react';

function ResumeEditorPage() {
  const [showFontPopup, setShowFontPopup] = useState(false);
  const [showColorPalette, setShowColorPalette] = useState(false);
  return (
    <div className="ResumeEditorPage">
      <TopBar></TopBar>
      <Sidebar onFontButtonClick={() => setShowFontPopup(true)} 
      onColorPaletteButtonClick={() => setShowColorPalette(true)}></Sidebar>
      <ResumeEditor />
      {showFontPopup && (
        <FontPopup onClose={() => setShowFontPopup(false)} />
      )}
      {showColorPalette && (
        <ColorPaletteModal
          onClose={() => setShowColorPalette(false)}
          onColorSelect={(color) => console.log('Selected color:', color)}
        />
      )}
    </div>
  );
}

export default ResumeEditorPage;