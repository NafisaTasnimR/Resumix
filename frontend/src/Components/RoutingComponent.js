import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PaymentInfo from './PaymentInfo/PaymentInfo';
import ResumeTemplates from './ResumeTemplates/ResumeTemplates';
import LoginSignup from './LoginSignup/LoginSignup';
import ResumeListPage from './ResumeListPage/ResumeListPage';

const RoutingComponent = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginSignup mode="login" />} />
            <Route path="/signup" element={<LoginSignup mode="signup" />} />
            <Route path="/templates" element={<ResumeTemplates />} />
            <Route path="/subscription" element={<PaymentInfo />} />
            <Route path="/resumes" element={<ResumeListPage />} />

        </Routes>
    );
};

export default RoutingComponent;
