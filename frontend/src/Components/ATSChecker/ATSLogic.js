// atsLogic.js — score + suggestions aligned

/** ---------- Text utils ---------- */
const toText = (v) => (typeof v === 'string' ? v.toLowerCase() : '');
const blobFromResume = (rd = {}) => {
  const PI = rd.personalInfo || {};
  const EDU = Array.isArray(rd.education) ? rd.education : [];
  const EXP = Array.isArray(rd.experience) ? rd.experience : [];
  const SK  = Array.isArray(rd.skills) ? rd.skills : [];
  const ACH = Array.isArray(rd.achievements) ? rd.achievements : [];
  const REF = Array.isArray(rd.references) ? rd.references : [];
  const PRJ = Array.isArray(rd.projects) ? rd.projects : [];
  const ADD = Array.isArray(rd.additionalInfos) ? rd.additionalInfos : [];

  return [
    PI.fullName, PI.professionalEmail, PI.address, PI.city, PI.district, PI.country,
    ...EDU.flatMap(e => [e.institution, e.degree, e.fieldOfStudy]),
    ...EXP.flatMap(e => [e.employerName, e.jobTitle, e.description]),
    ...SK.flatMap(s => [s.skillName, s.skillDescription]),
    ...ACH.flatMap(a => [a.title, a.organization, a.category, a.description]),
    ...PRJ.flatMap(p => [p.title, p.description]),
    ...ADD.flatMap(a => [a.sectionTitle, a.content]),
  ].filter(Boolean).map(toText).join(' ');
};

/** ---------- Heuristics shared by scoring & suggestions ---------- */
const regex = {
  metrics: /\b(\d+(\.\d+)?%|\$\s?\d[\d,]*|(?:improv|reduc|increas|boost)\w*\s+by\s+\d+%|\b\d+\s+(users|clients|projects|sales|teams|requests|tickets|repos|countries|cities)\b)/,
  actionVerbs: /\b(led|built|designed|developed|shipped|launched|optimized|automated|mentored|owned|drove|architected|deployed|migrated|scaled|integrated)\b/,
  passiveVoice: /\b(was|were|is|are|been|being)\s+\w+ed\b/,
};
const fillerWords = [
  'really','very','various','several','many','successfully','effectively','basically',
  'highly','significantly','quite','fairly','extremely','remarkably'
];
const hasFiller = (text) => fillerWords.some(w => text.includes(` ${w} `));

/** ---------- SCORE (unchanged signature) ---------- */
export const calculateAtsScore = (resumeData = {}) => {
  const clamp = (n, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, Math.round(n || 0)));

  const PI = resumeData.personalInfo || {};
  const EDU = Array.isArray(resumeData.education) ? resumeData.education : [];
  const EXP = Array.isArray(resumeData.experience) ? resumeData.experience : [];
  const SK  = Array.isArray(resumeData.skills) ? resumeData.skills : [];
  const ACH = Array.isArray(resumeData.achievements) ? resumeData.achievements : [];
  const REF = Array.isArray(resumeData.references) ? resumeData.references : [];
  const PRJ = Array.isArray(resumeData.projects) ? resumeData.projects : [];
  const ADD = Array.isArray(resumeData.additionalInfos) ? resumeData.additionalInfos : [];

  const text = blobFromResume(resumeData);

  let score = 0;

  /* ===== Base (reduced so 100 is rare) ===== */
  if (PI?.fullName) score += 10;
  if (PI?.professionalEmail?.includes('@')) score += 8;
  if (SK.length > 3) score += 17;
  if (EXP.length > 1) score += 15;
  if (EDU.length > 1) score += 10;

  /* ===== Boosters (smaller) ===== */
  if (PI?.phone && String(PI.phone).trim().length >= 6) score += 3;
  if (PI?.city || PI?.country) score += 2;

  const hasDetailInSkills = SK.some(s => s?.proficiencyLevel || Number.isFinite(s?.yearsOfExperience));
  if (hasDetailInSkills) score += 3;
  if (SK.length >= 8) score += 3;
  if (SK.length >= 12) score += 2;

  const hasCurrentJob = EXP.some(e => e?.isCurrentJob === true);
  const hasTitles     = EXP.some(e => !!e?.jobTitle);
  if (hasCurrentJob) score += 3;
  if (hasTitles) score += 2;

  const sixMonths = 1000 * 60 * 60 * 24 * 30 * 6;
  const has6mTenure = EXP.some(e => {
    const start = e?.startDate ? new Date(e.startDate).getTime() : NaN;
    const end   = e?.isCurrentJob ? Date.now() : (e?.endDate ? new Date(e.endDate).getTime() : NaN);
    return Number.isFinite(start) && Number.isFinite(end) && (end - start) >= sixMonths;
  });
  if (has6mTenure) score += 4;

  const hasDegreeNamed = EDU.some(e => !!e?.degree);
  if (hasDegreeNamed) score += 2;

  if (PRJ.length >= 1) score += 4;
  if (PRJ.length >= 2) score += 2;
  if (PRJ.length >= 3) score += 2;

  if (ACH.length >= 1) score += 3;
  if (ACH.length >= 3) score += 2;

  if (REF.length >= 1) score += 2;
  if (ADD.length >= 1) score += 1;

  const hasMetrics = regex.metrics.test(text);
  const hasActions = regex.actionVerbs.test(text);
  if (hasMetrics) score += 4;   
  if (hasActions) score += 3;   

  const penalize = (n) => { score -= Math.abs(n); };

  if (SK.length === 0) penalize(10);
  if (EXP.length === 0) penalize(12);
  if (text.includes('responsible for')) penalize(3);

  if (hasFiller(text)) penalize(3);     
  if (regex.passiveVoice.test(text)) penalize(4); 
  if (/\b(i|me|my|we|our)\b/.test(text)) penalize(3);

  return clamp(score, 0, 100);
};

/** ---------- Suggestions (checklist tied to score rules) ----------
 * Each item includes an estimated score delta the user can gain by fixing it.
 */
export const generateSuggestions = (resumeData = {}) => {
  const text = blobFromResume(resumeData);

  const hasMetrics  = regex.metrics.test(text);
  const hasFillerW  = hasFiller(text);
  const hasPassive  = regex.passiveVoice.test(text);
  const hasPronouns = /\b(i|me|my|we|our)\b/.test(text);

  const items = [
    {
      key: 'metrics',
      title: 'Quantify your impact',
      passed: hasMetrics,
      message: hasMetrics
        ? "Good job — your bullet points include metrics."
        : "Add numbers/percentages/KPIs (e.g., 'Reduced API latency by 35%').",
      potentialGain: hasMetrics ? 0 : 4,
    },
    {
      key: 'filler',
      title: 'Avoid filler words',
      passed: !hasFillerW,
      message: hasFillerW
        ? "Remove adverbs/vague terms (e.g., 'very', 'successfully', 'various')."
        : "Nice — no obvious filler words detected.",
      potentialGain: hasFillerW ? 3 : 0,
    },
    {
      key: 'active',
      title: 'Use active voice',
      passed: !hasPassive,
      message: hasPassive
        ? "Rewrite passive phrasing (e.g., 'API was developed' → 'Developed API')."
        : "Great — statements appear to be in active voice.",
      potentialGain: hasPassive ? 4 : 0,
    },
    {
      key: 'pronouns',
      title: 'Avoid personal pronouns',
      passed: !hasPronouns,
      message: hasPronouns
        ? "Remove first-person pronouns (I, me, my, we, our)."
        : "Looks good — no personal pronouns detected.",
      potentialGain: hasPronouns ? 3 : 0,
    },
  ];

  const totalPotentialGain = items.reduce((s, it) => s + it.potentialGain, 0);

  return { items, totalPotentialGain };
};
