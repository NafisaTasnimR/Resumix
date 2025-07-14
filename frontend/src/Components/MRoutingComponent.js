import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PaymentInfo from './PaymentInfo/PaymentInfo';
import ProfileForm from './ProfileForm/ProfileForm';
import ATSChecker from './ATSChecker/ATSChecker';
import FinishPage from './FinishPage/FinishPage';

const MRoutingComponent = () => {
    return (
        <Routes>   
            
            <Route path="payment" element={<PaymentInfo />} />
            <Route path="atschecker" element={<ATSChecker />} />
            <Route path="final" element={<FinishPage />} />
            

        </Routes>
    );
};

export default MRoutingComponent;