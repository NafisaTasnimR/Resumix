import { Link } from 'react-router-dom';
import './TemplatePreview.css';

const TemplatePreview = ({ id, template }) => {
  return (
    <div className="template-preview">
      <Link to={`/editor/${id}`}>
        <div className="iframe-container">
          <iframe
            src={`http://localhost:5000/preview/api/template/${id}`}
            title={template.name}
            className="preview-iframe"
            scrolling ="no"
          ></iframe>
        </div>
      </Link>
      <p>{template.name}</p>
    </div>
  );
};

export default TemplatePreview;