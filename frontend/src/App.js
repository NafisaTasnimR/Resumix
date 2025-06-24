import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Components/LandingPage/LandingPage';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import SettingsPage from './Components/Settings/SettingsPage';
import PostLoginHeader from './Components/PostLoginHeader/PostLoginHeader';
import ResumeTemplates from './Components/ResumeTemplates/ResumeTemplates';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginSignup mode="login" />} />
        <Route path="/signup" element={<LoginSignup mode="signup" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/templates" element={<ResumeTemplates />} />
      </Routes>
    </Router>
  );
}

export default App;