import React from 'react';
import { Route, Routes } from 'react-router-dom';

import ResumeListPage from './ResumeListPage/ResumeListPage';
import SettingsPage from './Settings/SettingsPage';
import ResumeEditor from './ResumeEditorPage/ResumeEditorPage';
import ResumeTemplates from './ResumeTemplates/ResumeTemplates';
import SubscriptionPage from './SubscriptionPage/SubscriptionPage';

const RoutingComponent = () => {
    return (
        <Routes>
            <Route path="/templates" element={<ResumeTemplates />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="/resumes" element={<ResumeListPage />} />
            <Route path="/settings" element={<SettingsPage />} /> 
            <Route path="/resumebuilder" element={<ResumeEditor />} />
             
        </Routes>
    );
};

export default RoutingComponent;
