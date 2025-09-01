import { useNavigate } from 'react-router-dom';
import './TemplatePreview.css';
import axios from 'axios';


const TemplatePreview = ({ id, template }) => {
  const navigate = useNavigate();

  const handleClick = async () => {
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
            scrolling ="no"
          ></iframe>
        </div>
      <p>{template.name}</p>
    </div>
  );
};

export default TemplatePreview;