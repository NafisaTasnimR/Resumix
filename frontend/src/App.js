import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Components/LandingPage/LandingPage';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import UserDashboard from './Components/DashBoard/UserDashboard';
import SettingsPage from './Components/Settings/SettingsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginSignup mode="login" />} />
        <Route path="/signup" element={<LoginSignup mode="signup" />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/settings" element={<SettingsPage />} />

      </Routes>
    </Router>
  );
}

export default App;