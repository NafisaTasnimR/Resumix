import React from 'react';
import { useNavigate } from 'react-router-dom';
import resume from '../../assets/icons8-resume-48.png';
import font from '../../assets/icons8-font-style-formatting-48.png'
import color from '../../assets/icons8-color-palette-48.png'
import ats_checker from '../../assets/icons8-check-document-48.png'

const Sidebar = ({onFontButtonClick, onColorPaletteButtonClick}) => {
    const navigate = useNavigate();
    
    return (
    <div className="sidebar">
        <button>
            <img src = {resume} alt="Template" width="30" height="30"/>
            <span>Template</span>
        </button>
        <button onClick={onFontButtonClick}>
            <img src={font} alt="Font" width="30" height="30"/>
            <span>Font</span>
        </button>
        <button onClick={onColorPaletteButtonClick}>
            <img src={color} alt="Color Palette" width="30" height="30"/>
            <span>Color Palette</span>
        </button>
        <button onClick={() => navigate('/m/atschecker')}>
            <img src={ats_checker} alt="ATS Checker" width="30" height="30"/>
            <span>ATS Checker</span>
        </button>
    </div>
    );
};

export default Sidebar;