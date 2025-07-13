import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Components/LandingPage/LandingPage';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import PostLoginHeader from './Components/PostLoginHeader/PostLoginHeader';
import RoutingComponent from './Components/RoutingComponent';
import MRoutingComponent from './Components/MRoutingComponent';
import ProfileForm from './Components/ProfileForm/ProfileForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginSignup mode="login" />} />
        <Route path="/signup" element={<LoginSignup mode="signup" />} />
        <Route path="/postlogin/" element={<PostLoginHeader />} />
        <Route path="/profile" element={<ProfileForm />} />
        <Route path="/m/*" element={<MRoutingComponent />} />
        <Route path="/*" element={<RoutingComponent />} />
      </Routes>
    </Router>
  );
}

export default App;