import React, { useState, useEffect } from 'react';
import './ATSChecker.css';
import { useNavigate, useLocation, useSearchParams, useParams } from 'react-router-dom';
import TopBar from '../ResumeEditorPage/TopBar';
import { calculateAtsScore, generateScoreData } from './ATSLogic';
import axios from 'axios';

/* ---------- Donut score ring ---------- */
const ScoreRing = ({ value = 0, size = 180, thickness = 22, color = '#10B981', track = '#FEF3D7' }) => {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - v / 100);
  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} stroke={track} strokeWidth={thickness} fill="none" />
        <circle
          cx={size/2} cy={size/2} r={r}
          stroke={color} strokeWidth={thickness} fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          className="score-ring__progress"
        />
      </svg>
      <div className="score-ring__center" style={{ color }}>{Math.round(v)}</div>
    </div>
  );
};

/* ---------- Helpers ---------- */
const getColor = (s) => (s >= 80 ? '#10B981' : s >= 60 ? '#F59E0B' : '#EF4444');

const Pill = ({ score }) => {
  const label = score >= 90 ? 'EXCELLENT' : score >= 75 ? 'GOOD' : score >= 60 ? 'AVERAGE' : 'NEEDS WORK';
  const bg = score >= 90 ? '#D1FAE5' : score >= 75 ? '#E7F9EF' : score >= 60 ? '#FFEAD5' : '#FEE2E2';
  const fg = score >= 90 ? '#059669' : score >= 75 ? '#10B981' : score >= 60 ? '#C2410C' : '#B91C1C';
  return <span className="cat-pill" style={{ background: bg, color: fg }}>{label}</span>;
};

/* ---------- Category card (with optional chips) ---------- */
const CategoryCard = ({ title, data, chipsTitle, chips }) => {
  if (!data) return null;
  return (
    <div className="cat-card">
      <div className="cat-card-head">
        <h3>{title.toUpperCase()} <span className="qmark">?</span></h3>
        <ScoreRing value={data.score} size={100} thickness={10} color={getColor(data.score)} track="#F1F5F9" />
      </div>
      <Pill score={data.score} />
      <ul className="cat-items">
        {data.items.map((it, i) => (
          <li key={i}>
            <span className={`metric-score ${it.score >= 9 ? 'ok' : it.score >= 7 ? 'warn' : 'bad'}`}>{it.score}</span>
            <span className="metric-name">{it.name}</span>
          </li>
        ))}
      </ul>

      {chips?.length ? (
        <div className="chip-list">
          <div className="chip-title">{chipsTitle}</div>
          <div className="chips">
            {chips.map((c, i) => <span className="chip" key={i}>{c}</span>)}
          </div>
        </div>
      ) : null}
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
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(false);

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

  // Compute score + breakdown and persist score
  useEffect(() => {
    const data = propResumeData ?? resume?.ResumeData ?? resume ?? null;
    if (!data || !resolvedId) return;

    const score = calculateAtsScore(data);
    // NOTE: for 3-panel layout, update generateScoreData in ATSLogic.js as I described
    setScoreData(generateScoreData(score, data, ''));

    const token = localStorage.getItem('token') || '';
    axios.patch(
      `http://localhost:5000/resume/updateResume/${resolvedId}`,
      { atsScore: score },
      { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
    ).catch(err => console.error('Error updating ATS score:', err));
  }, [propResumeData, resume, resolvedId]);

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
            <button className="delete-data-btn" onClick={() => navigate(-1)}>Back to Dashboard</button>
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

  const bd = scoreData.breakdown || {}; // expect: impact, brevity, style (soft skills folded into impact)

  return (
    <div className="resume-checker">
      <TopBar />
      <div className="ats-layout">
        {/* LEFT: donut + actions underneath */}
        <div className="ats-left">
          <div className="score-card">
            <h2>Your Score</h2>
            <ScoreRing
              value={scoreData.overall}
              color={getColor(scoreData.overall)}
              track="#FEF3D7"
              size={180}
              thickness={22}
            />
          </div>

          <div className="score-actions under-donut">
            <button
              className="edit-resume-btn"
              onClick={() => navigate(resolvedId ? `/resumebuilder/${resolvedId}` : '/resumebuilder')}
            >
              Edit &amp; Fix Resume
            </button>
            <button className="delete-data-btn" onClick={() => navigate(-1)}>
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* RIGHT: 3-panel breakdown (Impact includes soft skills) */}
        <div className="ats-right">
          <div className="breakdown-grid three-cols">
            <CategoryCard
              title="Impact"
              data={bd.impact}
              chipsTitle="Missing soft skills"
              chips={(bd.impact?.softskillsMissing || []).slice(0, 6)}
            />
            <CategoryCard title="Concise" data={bd.brevity} />
            <CategoryCard title="Style"   data={bd.style} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSChecker;