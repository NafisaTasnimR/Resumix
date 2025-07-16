import React, { useState, useEffect } from 'react';
import './ResumeTemplates.css';
import TemplatePreview from './TemplatePreview';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TopBar from '../ResumeEditorPage/TopBar';

const ResumeTemplates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all'); // Default to 'all' to show everything
  const [visibleCount, setVisibleCount] = useState(3);
  const [templatesData, setTemplatesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch templates from backend on mount
  useEffect(() => {
  const fetchTemplates = async () => {
    try {
      const res = await axios.get('http://localhost:5000/preview/api/templates');
      // If your backend returns { templates: [...] }
      setTemplatesData(res.data || []);
    } catch (err) {
      setTemplatesData([]);
      console.error('Error fetching templates:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchTemplates();
}, []);

  const normalizedTemplates = templatesData.map(template => ({
    ...template,
    category: template.category || 'all'
  }));

  const filteredTemplates = normalizedTemplates.filter(template => {
    const matchesFilter =
      currentFilter === 'all' ||
      template.category === currentFilter;
    const matchesSearch =
      searchTerm === '' ||
      (template.filename && template.filename.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (template.name && template.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

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
          <div>No templates found.</div>
        ) : (
          visibleTemplates.map((template) => (
            <div key={template._id || template.id} className="template-card">
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
