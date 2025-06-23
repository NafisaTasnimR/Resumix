import React, { useState } from 'react';
import './ResumeTemplates.css';

const ResumeTemplates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilter, setCurrentFilter] = useState('popular');
  const [visibleCount, setVisibleCount] = useState(3);

  // Sample templates data
  const templatesData = [
    { id: 1, category: 'popular', name: 'Template 1' },
    { id: 2, category: 'popular', name: 'Template 2' },
    { id: 3, category: 'popular', name: 'Template 3' },
    { id: 4, category: 'new', name: 'Template 4' },
    { id: 5, category: 'new', name: 'Template 5' },
    { id: 6, category: 'all', name: 'Template 6' },
    { id: 7, category: 'all', name: 'Template 7' },
    { id: 8, category: 'popular', name: 'Template 8' },
    { id: 9, category: 'new', name: 'Template 9' },
  ];

  const filteredTemplates = templatesData.filter(template => {
    const matchesFilter = currentFilter === 'all' || template.category === currentFilter || template.category === 'all';
    const matchesSearch = searchTerm === '' || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const visibleTemplates = searchTerm ? filteredTemplates : filteredTemplates.slice(0, visibleCount);

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
    setVisibleCount(3);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 3);
  };

  return (
    <div className="page-wrapper">
      <h1 className="page-title">Resume Templates</h1>
      
      <div className="search-bar-container">
        <input 
          type="text" 
          className="search-bar" 
          placeholder="Search here..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="search-icon">🔍</span>
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
        {visibleTemplates.map((template) => (
          <div key={template.id} className="template-card">
            <div className="template-placeholder">{template.name}</div>
          </div>
        ))}
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