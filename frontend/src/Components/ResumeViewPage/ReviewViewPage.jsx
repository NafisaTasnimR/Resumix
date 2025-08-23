import React, { useEffect, useState } from 'react';
import './ResumeViewPage.css';
import { useParams } from 'react-router-dom';
import ResumeRenderer from './ResumeRender';
import axios from 'axios';
import { Link } from 'react-router-dom';
import TopBar from '../ResumeEditorPage/TopBar';
import ErrorBoundary from './ErrorBoundary';

const ResumePreview = () => {
  const { id } = useParams();               // <-- read :id
  const [resume, setResume] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchResume = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/resume/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });
        setResume(res.data);
      } catch (err) {
        console.error('Error fetching resume:', err);
        const status = err?.response?.status;
        if (status === 404) setError('Resume not found.');
        else if (status === 401 || status === 403) setError('You are not authorized to view this resume.');
        else setError('Failed to load resume.');
      }
    };

    fetchResume();
  }, [id]);


  return (
  <div className="resume-page-container">
    <TopBar/>
    <header className="resume-view-header">
      <h1 className="resume-title">{resume?.title || "Nishat_Tasnim_Resume"}</h1>
      <Link to="/resumebuilder" className="edit-btn">Edit</Link>
    </header>

    <div className="resume-image-container">
      {/* add actual resume render in A4 layout */}
      {resume && (
          <ErrorBoundary>
            <ResumeRenderer resume={resume} />
          </ErrorBoundary>
      )}

      {error && <p className="error-message">{error}</p>}
      {!error && !resume && <p>Loading resume…</p>}
    </div>
  </div>
);
};

export default ResumePreview;