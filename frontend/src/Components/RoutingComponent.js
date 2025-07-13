import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PaymentInfo from './PaymentInfo/PaymentInfo';
import ResumeTemplates from './ResumeTemplates/ResumeTemplates';
import ResumeListPage from './ResumeListPage/ResumeListPage';
import SettingsPage from './Settings/SettingsPage';
import ResumeEditor from './ResumeEditorPage/ResumeEditorPage';
import NoAccountPage from './NoAccountPage/NoAccountPage';

const RoutingComponent = () => {
    return (
        <Routes>
            <Route path="/templates" element={<ResumeTemplates />} />
            <Route path="/subscription" element={<PaymentInfo />} />
            <Route path="/resumes" element={<ResumeListPage />} />
            <Route path="/settings" element={<SettingsPage />} /> 
            <Route path="/resumebuilder" element={<ResumeEditor />} />
            <Route path="/noaccount" element={<NoAccountPage />} />
            {/* Add other routes as needed */}

        </Routes>
    );
};

export default RoutingComponent;
