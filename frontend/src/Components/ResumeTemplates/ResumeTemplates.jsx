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
  const navigate = useNavigate();

  // Fetch templates from backend on mount
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await axios.get('http://localhost:5000/preview/api/templates');
        
        // Get stored click counts from localStorage
        const storedClicks = JSON.parse(localStorage.getItem('templateClicks') || '{}');
        
        // Initialize templates with clickCount from localStorage or 0
        const templatesWithClicks = (res.data || []).map(template => ({
          ...template,
          clickCount: storedClicks[template._id || template.id] || template.clickCount || 0
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

  // Handle browser back button and page visibility changes
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

    // Handle browser back/forward navigation
    const handlePopState = () => {
      setTimeout(refreshClickCounts, 100);
    };

    // Handle page visibility change (tab switching, etc.)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshClickCounts();
      }
    };

    // Handle window focus (when user returns to the browser)
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

  // Helper function to determine if a template is "new"
  const isNewTemplate = (template) => {
    if (!template.createdAt && !template.dateAdded) return false;
    
    const templateDate = new Date(template.createdAt || template.dateAdded);
    const now = new Date();
    const daysAgo = Math.floor((now - templateDate) / (1000 * 60 * 60 * 24));
    
    // Consider template "new" if created within reasonable timeframe
    const totalTemplates = templatesData.length;
    const newThreshold = Math.max(7, Math.ceil(totalTemplates * 0.15)); // At least 7 days or 15% of templates
    
    return daysAgo <= newThreshold;
  };

  // Helper function to sort templates by click count (popularity)
  const sortByPopularity = (templates) => {
    return [...templates].sort((a, b) => {
      const aClicks = a.clickCount || 0;
      const bClicks = b.clickCount || 0;
      return bClicks - aClicks;
    });
  };

  // Helper function to sort templates by date (newest first)
  const sortByDate = (templates) => {
    return [...templates].sort((a, b) => {
      const aDate = new Date(a.createdAt || a.dateAdded || 0);
      const bDate = new Date(b.createdAt || b.dateAdded || 0);
      return bDate - aDate;
    });
  };

  // Apply filtering and sorting logic
  const getFilteredAndSortedTemplates = () => {
    let filtered = templatesData.filter(template => {
      // Search filter
      const matchesSearch =
        searchTerm === '' ||
        (template.filename && template.filename.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (template.name && template.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesSearch;
    });

    // Apply filter-specific logic
    switch (currentFilter) {
      case 'popular':
        // Only show templates that have been clicked (popular)
        filtered = filtered.filter(template => (template.clickCount || 0) > 0);
        return sortByPopularity(filtered);
        
      case 'new':
        // Only show templates that are new
        filtered = filtered.filter(template => isNewTemplate(template));
        return sortByDate(filtered);
        
      case 'all':
      default:
        // Show all templates, sorted by a mix of popularity and recency
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

  // Function to handle template click and update click count
  const handleTemplateClick = (template) => {
    const templateId = template._id || template.id;
    const newClickCount = (template.clickCount || 0) + 1;
    
    // Update local state to increment click count
    setTemplatesData(prevTemplates => 
      prevTemplates.map(t => 
        (t._id || t.id) === templateId 
          ? { ...t, clickCount: newClickCount }
          : t
      )
    );

    // Save click counts to localStorage for persistence
    const storedClicks = JSON.parse(localStorage.getItem('templateClicks') || '{}');
    storedClicks[templateId] = newClickCount;
    localStorage.setItem('templateClicks', JSON.stringify(storedClicks));

    // Navigate to resume builder (your actual route)
   
  };

  return (
    <div className="page-wrapper">
      <TopBar />
      <div className="green-header">
        <h1 className="page-title">Templates</h1>
      </div>

      <div className="search-bar-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search here..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
              ? 'No popular templates at the moment.' 
              : currentFilter === 'new' 
              ? 'No new templates found.' 
              : 'No templates found.'
            }
          </div>
        ) : (
          visibleTemplates.map((template) => (
            <div 
              key={template._id || template.id} 
              className="template-card"
              onClick={() => handleTemplateClick(template)}
            >
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