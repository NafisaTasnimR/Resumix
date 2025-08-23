import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ResumeTemplates.css";
import "./TemplatePreview.css";

const TemplatePreviewGuest = ({ id, template }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate("/login");
  };

  return (
    <div className="template-preview" onClick={handleClick}>
      <div className="iframe-container">
        <iframe
          src={`http://localhost:5000/preview/api/template/${id}`}
          title={template?.name || "Template"}
          className="preview-iframe"
          scrolling="no"
        />
      </div>
      <p>{template?.name}</p>
    </div>
  );
};

const PublicTemplates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(3);
  const [templatesData, setTemplatesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/preview/api/templates"
        );

        const storedClicks = JSON.parse(
          localStorage.getItem("templateClicks") || "{}"
        );

        const withClicks = (res.data || []).map((template, index) => ({
          ...template,
          clickCount:
            storedClicks[template._id || template.id] ||
            template.clickCount ||
            0,
          // keep your premium badge heuristics
          isPremium:
            template.isPremium ||
            index === 2 ||
            index === 5 ||
            (template.filename &&
              (template.filename.includes("Resume3") ||
                template.filename.includes("Resume6"))) ||
            (template.name &&
              (template.name.includes("Resume3") ||
                template.name.includes("Resume6"))),
        }));

        setTemplatesData(withClicks);
      } catch (err) {
        console.error("Error fetching templates:", err);
        setTemplatesData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // Helpers copied from your page
  const isNewTemplate = (template) => {
    if (!template.createdAt && !template.dateAdded) return false;
    const templateDate = new Date(template.createdAt || template.dateAdded);
    const daysAgo = Math.floor((Date.now() - templateDate.getTime()) / 86400000);
    const total = templatesData.length;
    const newThreshold = Math.max(7, Math.ceil(total * 0.15));
    return daysAgo <= newThreshold;
  };

  const sortByPopularity = (templates) =>
    [...templates].sort(
      (a, b) => (b.clickCount || 0) - (a.clickCount || 0)
    );

  const sortByDate = (templates) =>
    [...templates].sort(
      (a, b) =>
        new Date(b.createdAt || b.dateAdded || 0) -
        new Date(a.createdAt || a.dateAdded || 0)
    );

  const getFilteredAndSortedTemplates = () => {
    let filtered = templatesData.filter((t) => {
      const q = searchTerm.trim().toLowerCase();
      if (!q) return true;
      return (
        (t.filename && t.filename.toLowerCase().includes(q)) ||
        (t.name && t.name.toLowerCase().includes(q))
      );
    });

    switch (currentFilter) {
      case "popular":
        filtered = filtered.filter((t) => (t.clickCount || 0) > 0);
        return sortByPopularity(filtered);
      case "new":
        filtered = filtered.filter((t) => isNewTemplate(t));
        return sortByDate(filtered);
      case "all":
      default:
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

  const handleLoadMore = () => setVisibleCount((v) => v + 3);

  return (
    <div className="page-wrapper">
      {/* No TopBar here on purpose */}
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
        <span className="search-icon">⌕</span>
      </div>

      <div className="tabs">
        <div
          className={`tab ${currentFilter === "popular" ? "active" : ""}`}
          onClick={() => handleFilterChange("popular")}
        >
          Popular
        </div>
        <div
          className={`tab ${currentFilter === "new" ? "active" : ""}`}
          onClick={() => handleFilterChange("new")}
        >
          New
        </div>
        <div
          className={`tab ${currentFilter === "all" ? "active" : ""}`}
          onClick={() => handleFilterChange("all")}
        >
          All
        </div>
      </div>

      <div className="templates">
        {loading ? (
          <div>Loading templates...</div>
        ) : visibleTemplates.length === 0 ? (
          <div>
            {currentFilter === "popular"
              ? "No popular templates at the moment."
              : currentFilter === "new"
              ? "No new templates found."
              : "No templates found."}
          </div>
        ) : (
          visibleTemplates.map((template) => (
            <div
              key={template._id || template.id}
              className="template-card"
              // no onClick here; the inner preview handles it and sends to /noaccount
            >
              {template.isPremium && (
                <div className="minimal-pro-badge">
                  <img src="/crown.png" alt="Premium" className="crown-icon" />
                </div>
              )}

              <TemplatePreviewGuest
                id={template._id || template.id}
                template={template}
              />
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

export default PublicTemplates;
