import React, { useState, useEffect } from 'react';
import './ATSChecker.css';
import { useNavigate, useLocation, useSearchParams, useParams } from 'react-router-dom';
import TopBar from '../ResumeEditorPage/TopBar';
import { calculateAtsScore, generateSuggestions } from './ATSLogic';
import axios from 'axios';

/* ---------- Donut score ring ---------- */
const ScoreRing = ({ value = 0, size = 140, thickness = 16, color = '#22C55E', track = '#E5F5EA' }) => {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - v / 100);
  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={thickness} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={color} strokeWidth={thickness} fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          className="score-ring__progress"
        />
      </svg>
      <div className="score-ring__center" style={{ color }}>{Math.round(v)}</div>
    </div>
  );
};

const ATSChecker = ({ resumeData: propResumeData, resumeId: propResumeId }) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [sp] = useSearchParams();
  const { id: routeParamId } = useParams();
  const resolvedId = propResumeId || state?.resumeId || sp.get('id') || routeParamId || null;

  const [resume, setResume] = useState(propResumeData || null);
  const [scoreData, setScoreData] = useState(null);
  const [suggItems, setSuggItems] = useState([]);
  const [suggTotalGain, setSuggTotalGain] = useState(0);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const backToDashboard = () => {
    setLeaving(true);
    setTimeout(() => {
      navigate('/dashboard', {
        state: { updatedScore: { id: resolvedId, score: scoreData?.overall ?? 0 } }
      });
    }, 60);
  };

  // Fetch resume if needed
  useEffect(() => {
    if (resume || !resolvedId || propResumeData) return;
    setLoading(true);
    const token = localStorage.getItem('token') || '';
    axios.get(`http://localhost:5000/resume/${resolvedId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setResume(res.data))
      .catch(err => {
        const st = err?.response?.status;
        if (st === 404) setLoadError('Resume not found.');
        else if (st === 401 || st === 403) setLoadError('Not authorized to view this resume.');
        else setLoadError('Failed to load resume.');
        console.error('Failed to load resume for ATS:', err);
      })
      .finally(() => setLoading(false));
  }, [resolvedId, resume, propResumeData]);

  // Compute score + suggestions
  useEffect(() => {
    const data = propResumeData ?? resume?.ResumeData ?? resume ?? null;
    if (!data || !resolvedId) return;

    const score = calculateAtsScore(data);
    setScoreData({ overall: score });

    const { items, totalPotentialGain } = generateSuggestions(data);
    setSuggItems(items || []);
    setSuggTotalGain(totalPotentialGain || 0);

    // persist strength
    const token = localStorage.getItem('token') || '';
    if (Number(resume?.strength) === Number(score)) return;
    axios.patch(
      `http://localhost:5000/resume/updateResume/${resolvedId}`,
      { strength: score },
      { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
    ).catch(err => console.error('Error updating strength:', err));
  }, [propResumeData, resume, resolvedId]);

  if (leaving) {
    return (
      <div className="resume-checker loading-screen">
        <TopBar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Returning to dashboard…</p>
        </div>
      </div>
    );
  }

  if (!propResumeData && !resolvedId) {
    return (
      <div className="resume-checker">
        <TopBar />
        <div className="main-container">
          <div className="content-area" style={{ padding: 24 }}>
            <h2>ATS Checker</h2>
            <p>Open this page from the Dashboard’s <b>ATS Check</b> button.</p>
            <button className="delete-data-btn" onClick={() => navigate(-1)}>Back to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="resume-checker loading-screen">
        <TopBar />
        <div className="loading-container"><div className="spinner"></div><p>Loading resume…</p></div>
      </div>
    );
  }
  if (loadError) {
    return (
      <div className="resume-checker">
        <TopBar />
        <div className="main-container">
          <div className="content-area" style={{ padding: 24 }}>
            <h2>ATS Checker</h2>
            <p>{loadError}</p>
            <button className="delete-data-btn" onClick={backToDashboard}>Back to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }
  if (!scoreData) {
    return (
      <div className="resume-checker loading-screen">
        <TopBar />
        <div className="loading-container"><div className="spinner"></div><p>Calculating ATS score…</p></div>
      </div>
    );
  }

  // very lightweight summary line like the SS
  const summary = scoreData.overall >= 80
    ? 'The resume is well-structured and highlights relevant experience and skills. Consider adding more quantified achievements.'
    : scoreData.overall >= 60
      ? 'Good foundation. Add measurable results, tighten language, and emphasize impact to raise your score.'
      : 'Core sections are present, but you can significantly improve by adding metrics, clarifying impact, and reducing filler.';

  return (
    <div className="resume-checker">
      <TopBar />

      {/* Big Card */}
      <div className="ats-analysis-card">
        <div className="ats-card-header">
          <h2>Analysis Result</h2>
        </div>

        <div className="ats-card-body">
          <div className="score-block">
            <ScoreRing value={scoreData.overall} />
          </div>

          <p className="analysis-summary" style={{ marginTop: 15, marginBottom: 32 }}>
            {summary}
          </p>

          <ul className="analysis-list">
            {suggItems.map((it, i) => {
              const passed = !!it.passed;
              return (
                <li key={i} className={`analysis-item ${passed ? 'ok' : 'warn'}`}>
                  <div className="analysis-icon">{passed ? '✓' : '✗'}</div>
                  <div className="analysis-text">
                    <div className="analysis-title">{it.title}</div>
                    <div className="analysis-desc">{it.message}</div>
                  </div>
                </li>
              );
            })}
          </ul>

        </div>
      </div>

      {/* Buttons at bottom */}
      <div className="score-actions">
        <button
          className="edit-resume-btn"
          onClick={() => navigate(resolvedId ? `/resumebuilder/${resolvedId}` : '/resumebuilder')}
        >
          Edit &amp; Fix Resume
        </button>
        <button className="delete-data-btn" onClick={backToDashboard}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ATSChecker;