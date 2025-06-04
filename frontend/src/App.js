import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Components/LandingPage/LandingPage';
import LoginSignup from './Components/LoginSignup/LoginSignup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginSignup mode="login" />} />
        <Route path="/signup" element={<LoginSignup mode="signup" />} />
      </Routes>
    </Router>
  );
}

export default App;