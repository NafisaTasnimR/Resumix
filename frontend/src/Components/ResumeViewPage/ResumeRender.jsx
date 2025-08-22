import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';

// Helper function to safely access object properties (e.g., "personalInfo.fullName")
const get = (obj, path) => path.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : ''), obj);

// Replace placeholders like {{personalInfo.fullName}} with actual resume data
function fillTemplate(raw, data) {
  return raw.replace(/{{\s*([^}]+)\s*}}/g, (_, key) => {
    // Handle array access like education[0].institution
    const value = key.replace(/\[(\d+)\]/g, '.$1'); // Convert [0] to .0
    const out = get(data, value);
    // If it's a Date object, format it
    if (out instanceof Date) return new Date(out).toLocaleDateString();
    return out ?? '';  // Return the value or an empty string
  });
}

const ResumeRenderer = ({ resume }) => {
  const [tplCss, setTplCss] = useState('');
  const [tplBodyRaw, setTplBodyRaw] = useState(''); // The raw template HTML with placeholders

  // Fetch template HTML and CSS using the templateId from the resume
  useEffect(() => {
    const run = async () => {
      if (!resume?.templateId) return;

      try {
        const response = await axios.get(`http://localhost:5000/preview/api/template/parts/${resume.templateId}`);
        setTplCss(response.data.templateCss || '');  // Set the CSS
        setTplBodyRaw(response.data.rawTemplate || '');  // Set the raw HTML template
      } catch (e) {
        console.error('Failed to load template:', e);
      }
    };
    run();
  }, [resume?.templateId]);

  // Apply the template to the resume data
  const finalHtml = useMemo(() => {
    if (!tplBodyRaw || !resume?.ResumeData) return '';
    return fillTemplate(tplBodyRaw, resume?.ResumeData);  // Replace placeholders in the template
  }, [tplBodyRaw, resume?.ResumeData]);

  return (
    <div className={`resume-template ${resume?.templateId}`}>
      {/* Inject the template CSS */}
      <style dangerouslySetInnerHTML={{ __html: tplCss }} />

      {/* Render filled template HTML */}
      {finalHtml && <div dangerouslySetInnerHTML={{ __html: finalHtml }} />}
    </div>
  );
};

export default ResumeRenderer;
