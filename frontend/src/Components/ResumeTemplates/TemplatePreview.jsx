import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TemplatePreview.css';
import axios from 'axios';

const TemplatePreview = ({ id, template }) => {
  const navigate = useNavigate();
  const [subscriptionStatus, setSubscriptionStatus] = useState('free');

  // Fetch subscription status
  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken') || sessionStorage.getItem('token');
        
        if (!token) {
          setSubscriptionStatus('free');
          return;
        }

        const response = await fetch('http://localhost:5000/api/payment/subscription-status', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const isPaid = data.hasActiveSubscription;
          setSubscriptionStatus(isPaid ? 'paid' : 'free');
        } else {
          setSubscriptionStatus('free');
        }
      } catch (error) {
        console.error('Error fetching subscription status:', error);
        setSubscriptionStatus('free');
      }
    };

    fetchSubscriptionStatus();
  }, []);

  const handleClick = async () => {
    // Check if template is premium and user is free
    if (template.isPremium && subscriptionStatus === 'free') {
      navigate('/subscription');
      return;
    }

    try {
      // Fetch raw HTML from backend
      const res = await axios.get(`http://localhost:5000/preview/api/template/parts/${id}`);
      const rawHTML = res.data.rawTemplate;
      const templateCss = res.data.templateCss || "";

      // Navigate with template HTML in router state
      navigate('/resumebuilder', {
        state: {
          rawTemplate: rawHTML,
          templateCss: templateCss,
          templateName: template.name,
          templateId: id
        }
      });
    } catch (error) {
      console.error("Failed to load template HTML:", error);
    }
  };

  return (
    <div className="template-preview" onClick={handleClick}>
        <div className="iframe-container">
          <iframe
            src={`http://localhost:5000/preview/api/template/${id}`}
            title={template.name}
            className="preview-iframe"
            scrolling="no"
          ></iframe>
        </div>
      <p>{template.name}</p>
    </div>
  );
};

export default TemplatePreview;