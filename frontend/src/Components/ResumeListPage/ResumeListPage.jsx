import React, { useEffect, useState } from 'react';
import './ResumeListPage.css';
import { Link, useNavigate } from 'react-router-dom';
import ShareResumeModal from './ShareResumeModal';
import DownloadResumeModal from './DownloadResumeModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import TopBar from '../ResumeEditorPage/TopBar';
import axios from 'axios';

const API_BASE = (import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:5000';

const ResumeListPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);          // delete confirm (UNCHANGED)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const [resumes, setResumes] = useState([]);                     // real data
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [resumeError, setResumeError] = useState('');

  const [selectedResume, setSelectedResume] = useState(null);     // for delete (UNCHANGED)
  const [resumeName, setResumeName] = useState('');               // for modals
  const [downloadLink, setDownloadLink] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [shareError, setShareError] = useState('');
  const [shareLoadingId, setShareLoadingId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoadingResumes(true);
        setResumeError('');
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE}/resume/all`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        // Controller returns an array (sorted). :contentReference[oaicite:2]{index=2}
        const list = Array.isArray(res.data?.resumes) ? res.data.resumes : res.data;
        setResumes(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error('Resume fetch failed', e);
        setResumeError('Could not load your resumes.');
      } finally {
        setLoadingResumes(false);
      }
    };

    fetchResumes();
  }, []);

  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '—';

  const buildFrontendPublicUrl = (token) => `${window.location.origin}/public/resume/${token}`;

  // Keep delete flow as-is; only open the confirm modal
  const handleRemoveClick = (resume) => {
    setSelectedResume(resume);
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    // Keep as-is (you’ll wire actual delete later)
    console.log(`Deleted resume: ${selectedResume?.title || selectedResume?.name}`);
    setIsModalOpen(false);
  };

  const handleShareClick = async (resume) => {
    setResumeName(resume.title || 'Untitled');
    setShareError('');
    setShareLink('');
    setShareLoadingId(resume._id);

    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      let url = '';

      // Try POST create/rotate
      try {
        const r = await axios.post(`${API_BASE}/resume/${resume._id}/share`, {}, { headers });
        const d = r?.data || {};
        if (d.url) url = d.url;
        else if (d.token) url = buildFrontendPublicUrl(d.token);
      } catch {
        // Fallback: GET existing
        const r = await axios.get(`${API_BASE}/resume/${resume._id}/share`, { headers });
        const d = r?.data || {};
        if (d.url) url = d.url;
        else if (d.token) url = buildFrontendPublicUrl(d.token);
      }

      if (!url) {
        setShareError("Share link isn’t available yet.");
        setIsShareModalOpen(true);
        return;
      }

      setShareLink(url);
      setIsShareModalOpen(true);
    } catch (e) {
      console.error('Share link error', e);
      setShareError('Could not generate a shareable link. Please try again.');
      setIsShareModalOpen(true);
    } finally {
      setShareLoadingId(null);
    }
  };

  const handleDownloadClick = async (resume) => {
    try {
      const token = localStorage.getItem('token') || '';
      const res = await axios.get(`${API_BASE}/download/resume/${resume._id}/pdf`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` },
      });
      const blobUrl = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      setResumeName(resume.title || 'resume');
      setDownloadLink(blobUrl);
      setIsDownloadModalOpen(true);
    } catch (e) {
      alert('Could not download PDF.');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsShareModalOpen(false);
    setIsDownloadModalOpen(false);
  };

  return (
    <div className="resume-fullpage">
      <div className="resume-header">
        <TopBar />
        <h2>My Resumes</h2>
        <div className="header-actions">
          <Link to="/resumebuilder" className="create-btn">Create New Resume</Link>
        </div>
      </div>

      <div className="resume-table">
        <div className="resume-table-header">
          <span>MY RESUMES</span>
          <span>MODIFICATION</span>
          <span>CREATION</span>
          <span>STRENGTH</span>
          <span>ACTIONS</span>
        </div>

        {loadingResumes && (
          <div className="resume-table-row"><span>Loading your resumes…</span></div>
        )}
        {resumeError && (
          <div className="resume-table-row"><span>{resumeError}</span></div>
        )}
        {!loadingResumes && !resumeError && resumes.length === 0 && (
          <div className="resume-table-row"><span>No resumes yet. Create one!</span></div>
        )}

        {!loadingResumes && !resumeError && resumes.map((r) => (
          <div className="resume-table-row" key={r._id}>
            {/* Keep CSS: NOT a button. Click event triggers navigation. */}
            <span
              className="resume-name-link"
              role="link"
              tabIndex={0}
              onClick={() => navigate(`/resumeview/${r._id}`)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate(`/resumeview/${r._id}`)}
              title="Open resume"
            >
              {r.title || 'Untitled'}
            </span>

            <span>{fmt(r.updatedAt || r.createdAt)}</span>
            <span>{fmt(r.createdAt)}</span>
            <span className="strength-badge">{r.strength ?? '—'}</span>

            <span className="actions">
              {/* Keep your Edit button exactly as was */}
              <Link to="/resumebuilder" state={{ resumeId: r._id }}   // <-- add this
                className="action-link-btn">Edit</Link>

              <button onClick={() => handleDownloadClick(r)}>Download</button>
              <button onClick={() => handleShareClick(r)}>
                {shareLoadingId === r._id ? 'Loading…' : 'Link'}
              </button>
              <button onClick={() => handleRemoveClick(r)}>Remove</button>
            </span>
          </div>
        ))}
      </div>

      <ShareResumeModal
        isOpen={isShareModalOpen}
        onClose={handleCloseModal}
        resumeLink={shareLink}
        resumeName={resumeName}
        error={shareError}
      />
      <DownloadResumeModal
        isOpen={isDownloadModalOpen}
        onClose={handleCloseModal}
        resumeName={resumeName}
        downloadLink={downloadLink}
      />
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ResumeListPage;
