import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import resume from '../../assets/icons8-resume-48.png';
import font from '../../assets/icons8-font-style-formatting-48.png'
import color from '../../assets/icons8-color-palette-48.png'
import ats_checker from '../../assets/icons8-check-document-48.png'

const Sidebar = ({ onFontButtonClick, onColorPaletteButtonClick }) => {
    const navigate = useNavigate();
    const clickTimerRef = useRef(null);

    const handleFontButtonClick = () => {
        if (clickTimerRef.current) {
            // second click → reset font (double-click)
            clearTimeout(clickTimerRef.current);
            clickTimerRef.current = null;
            window.dispatchEvent(new CustomEvent('resume-reset-font'));
            try { localStorage.removeItem('resumix_recent_font'); } catch { }
            return;
        }
        // first click → arm timer to open popup if no second click
        clickTimerRef.current = setTimeout(() => {
            clickTimerRef.current = null;
            onFontButtonClick?.();
        }, 250);
    };

    return (
        <div className="sidebarR">
            <button onClick={() => navigate('/templates')}>
                <img src={resume} alt="Template" width="30" height="30" />
                <span>Template</span>
            </button>
            <button onClick={handleFontButtonClick}>
                <img src={font} alt="Font" width="30" height="30" />
                <span>Font</span>
            </button>
            <button onClick={onColorPaletteButtonClick}>
                <img src={color} alt="Color Palette" width="30" height="30" />
                <span>Color Palette</span>
            </button>
        </div>
    );
};

export default Sidebar;