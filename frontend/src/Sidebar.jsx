import React from 'react';
import resume from './assets/icons8-resume-48.png'; 
import font from './assets/icons8-font-style-formatting-48.png'// Adjust the path as necessary
import color from './assets/icons8-color-palette-48.png'// Adjust the path as necessary
import ats_checker from './assets/icons8-check-document-48.png'// Adjust the path as necessary



const Sidebar = () => (
    <div className="sidebar">
        <button>
            <img src = {resume} alt="Template" width="30" height="30"/>
            <span>Template</span>
        </button>
        <button>
            <img src={font} alt="Font" width="30" height="30"/>
            <span>Font</span>
        </button>
        <button>
            <img src={color} alt="Color Palette" width="30" height="30"/>
            <span>Color Palette</span>
        </button>
        <button>
            <img src={ats_checker} alt="ATS Checker" width="30" height="30"/>
            <span>ATS Checker</span>
        </button>
    </div>
);

export default Sidebar;