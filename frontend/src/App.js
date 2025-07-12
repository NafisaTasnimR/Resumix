import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Components/LandingPage/LandingPage';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import SettingsPage from './Components/Settings/SettingsPage';
import PostLoginHeader from './Components/PostLoginHeader/PostLoginHeader';
import SubscriptionPage from './Components/SubscriptionPage/SubscriptionPage';
import PaymentInfo from './Components/PaymentInfo/PaymentInfo';
import ProfileForm from './Components/ProfileForm/ProfileForm';
import FinishPage from './Components/FinishPage/FinishPage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginSignup mode="login" />} />
        <Route path="/signup" element={<LoginSignup mode="signup" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/payment" element={<PaymentInfo />} />
        <Route path="/profile" element={<ProfileForm />} />
        <Route path="/final" element={<FinishPage />} />
      </Routes>
    </Router>
  );
}

export default App;