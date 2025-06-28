import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PaymentInfo from './PaymentInfo/PaymentInfo';
import ResumeTemplates from './ResumeTemplates/ResumeTemplates';
import ResumeListPage from './ResumeListPage/ResumeListPage';
import LoginSignup from './LoginSignup/LoginSignup';
import SettingsPage from './Settings/SettingsPage';

const PostLandingComponent = () => {
    return (
        <Routes>
            <Route path="/templates" element={<ResumeTemplates />} />
            <Route path="/subscription" element={<PaymentInfo />} />
            <Route path="/resumes" element={<ResumeListPage />} />
            <Route path="/login" element={<LoginSignup mode="login" />} />
            <Route path="/signup" element={<LoginSignup mode="signup" />} />
            <Route path="/settings" element={<SettingsPage />} />
        </Routes>
    );
};

export default PostLandingComponent;

