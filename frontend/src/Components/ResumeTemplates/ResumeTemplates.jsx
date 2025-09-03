import React, { useState, useEffect } from 'react';
import './ResumeTemplates.css';
import TemplatePreview from './TemplatePreview';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TopBar from '../ResumeEditorPage/TopBar';

const ResumeTemplates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(3);
  const [templatesData, setTemplatesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false); 
  const navigate = useNavigate();

  // Fetch templates from backend on mount
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await axios.get('http://localhost:5000/preview/api/templates');
        
        const storedClicks = JSON.parse(localStorage.getItem('templateClicks') || '{}');
        
        const templatesWithClicks = (res.data || []).map((template, index) => ({
          ...template,
          clickCount: storedClicks[template._id || template.id] || template.clickCount || 0,
          isPremium: template.isPremium || 
            index === 2 || 
            index === 6 || 
            (template.filename && (template.filename.includes('Resume3') || template.filename.includes('Resume7'))) ||
            (template.name && (template.name.includes('Resume3') || template.name.includes('Resume7')))
        }));
        
        setTemplatesData(templatesWithClicks);
      } catch (err) {
        setTemplatesData([]);
        console.error('Error fetching templates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  useEffect(() => {
    const refreshClickCounts = () => {
      const storedClicks = JSON.parse(localStorage.getItem('templateClicks') || '{}');
      setTemplatesData(prevTemplates => 
        prevTemplates.map(template => ({
          ...template,
          clickCount: storedClicks[template._id || template.id] || template.clickCount || 0
        }))
      );
    };

    const handlePopState = () => {
      setTimeout(refreshClickCounts, 100);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshClickCounts();
      }
    };

    const handleFocus = () => {
      refreshClickCounts();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const sortByPopularity = (templates) => {
    return [...templates].sort((a, b) => {
      const aClicks = a.clickCount || 0;
      const bClicks = b.clickCount || 0;
      return bClicks - aClicks;
    });
  };

  const sortByNameDescending = (templates) => {
    return [...templates].sort((a, b) => {
      // Sort by name/filename in descending order (Template3, Template2, Template1)
      const aName = a.filename || a.name || '';
      const bName = b.filename || b.name || '';
      return bName.localeCompare(aName);
    });
  };
  
  const getFilteredAndSortedTemplates = () => {
    let filtered = templatesData.filter(template => {
      // Search filter
      const matchesSearch =
        searchTerm === '' ||
        (template.filename && template.filename.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (template.name && template.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesSearch;
    });

    switch (currentFilter) {
      case 'popular':
        // Sort all templates by popularity first
        const sortedByPopularity = sortByPopularity(filtered);
        
        // Only show templates that have been clicked AND are in top 60%
        const clickedTemplates = sortedByPopularity.filter(template => (template.clickCount || 0) > 0);
        
        if (clickedTemplates.length === 0) {
          return []; // No clicked templates yet
        }
        
        // Calculate top 60% (minimum 1 template, maximum available)
        const topPercentage = Math.max(1, Math.ceil(clickedTemplates.length * 0.6));
        
        return clickedTemplates.slice(0, topPercentage);
        
      case 'new':
        // Sort by name in descending order and take fixed number
        const sortedByName = sortByNameDescending(filtered);
        
        // Take the 4 most recent templates by name (you can change to 3 if preferred)
        const numberOfNewTemplates = 4;
        
        return sortedByName.slice(0, numberOfNewTemplates);
        
      case 'all':
      default:
        // Sort by popularity for 'all' view
        return sortByPopularity(filtered);
    }
  };

  const filteredTemplates = getFilteredAndSortedTemplates();
  
  const visibleTemplates = searchTerm
    ? filteredTemplates
    : filteredTemplates.slice(0, visibleCount);

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
    setVisibleCount(3);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 3);
  };

  const handleTemplateClick = (e, template) => {
    if (isNavigating) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsNavigating(true);
    
    const templateId = template._id || template.id;
    const newClickCount = (template.clickCount || 0) + 1;
    
    // Update local state
    setTemplatesData(prevTemplates => 
      prevTemplates.map(t => 
        (t._id || t.id) === templateId 
          ? { ...t, clickCount: newClickCount }
          : t
      )
    );

    // Update localStorage
    const storedClicks = JSON.parse(localStorage.getItem('templateClicks') || '{}');
    storedClicks[templateId] = newClickCount;
    localStorage.setItem('templateClicks', JSON.stringify(storedClicks));

    setTimeout(() => setIsNavigating(false), 1000);
  };

  return (
    <div className="page-wrapper">
      <TopBar />
      <div className="green-header">
        <h1 className="page-title">Templates</h1>
      </div>

      <div className="tabs">
        <div
          className={`tab ${currentFilter === 'popular' ? 'active' : ''}`}
          onClick={() => handleFilterChange('popular')}
        >
          Popular
        </div>
        <div
          className={`tab ${currentFilter === 'new' ? 'active' : ''}`}
          onClick={() => handleFilterChange('new')}
        >
          New
        </div>
        <div
          className={`tab ${currentFilter === 'all' ? 'active' : ''}`}
          onClick={() => handleFilterChange('all')}
        >
          All
        </div>
      </div>

      <div className="templates">
        {loading ? (
          <div>Loading templates...</div>
        ) : visibleTemplates.length === 0 ? (
          <div>
            {currentFilter === 'popular' 
              ? 'No popular templates yet. Templates need to be used by multiple people to appear here.' 
              : currentFilter === 'new' 
              ? 'No new templates available.' 
              : 'No templates found.'
            }
          </div>
        ) : (
          visibleTemplates.map((template) => (
            <div 
              key={template._id || template.id} 
              className="template-card"
              onClick={(e) => handleTemplateClick(e, template)}
            >
              {/* Premium Badge - minimalistic bottom-right */}
              {template.isPremium && (
                <div className="minimal-pro-badge">
                  <img 
                    src="/crown.png" 
                    alt="Premium" 
                    className="crown-icon"
                  />
                </div>
              )}
              
              <TemplatePreview id={template._id || template.id} template={template} />
            </div>
          ))
        )}
      </div>

      {!searchTerm && visibleCount < filteredTemplates.length && (
        <div className="load-more-section">
          <button className="load-more-btn" onClick={handleLoadMore}>
            Load More Templates
          </button>
        </div>
      )}
    </div>
  );
};

export default ResumeTemplates;