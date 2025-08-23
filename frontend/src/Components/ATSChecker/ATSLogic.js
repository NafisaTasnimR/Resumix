// atsLogic.js

/**
 * Calculate ATS score from resume data
 * @param {Object} resumeData - Current resume
 * @returns {number} ATS score (0-100)
 */
export const calculateAtsScore = (resumeData) => {
  let score = 0;

  // Personal Info
  if (resumeData.personalInfo?.fullName) score += 20;
  if (resumeData.personalInfo?.professionalEmail?.includes("@")) score += 20;

  // Skills
  if (resumeData.skills?.length > 3) score += 30;

  // Experience
  if (resumeData.experience?.length > 1) score += 20;

  // Education
  if (resumeData.education?.length > 1) score += 10;

  return score;
};

/**
 * Generate the full scoreData object for UI
 * @param {number} score - Overall score
 * @returns {Object} Score breakdown and issues
 */
// --- keep your existing calculateAtsScore(resume) ---

const STRONG_VERBS = ['led','built','created','increased','reduced','designed','launched','optimized','delivered','automated','migrated','implemented','architected'];
const WEAK_VERBS   = ['helped','worked on','participated','assisted','responsible for','involved in'];
const FILLERS      = ['very','really','just','quite','basically','literally','highly','extremely'];
const BUZZWORDS    = ['synergy','leverage','results-driven','go-getter','wheelhouse','rockstar','ninja','guru','best-in-class','blue-sky'];

// Soft skills list still used, but now contributes to Impact
const SOFT_SKILLS  = ['communication','analytical','teamwork','leadership','initiative','ownership','collaboration','problem solving','adaptability','creativity'];

function textFromResume(resume = {}) {
  const parts = [];
  const add = (x) => { if (!x) return; if (Array.isArray(x)) x.forEach(add); else if (typeof x === 'object') Object.values(x).forEach(add); else if (typeof x === 'string') parts.push(x); };
  return parts.join(' ').replace(/\s+/g, ' ').trim().toLowerCase();
}

function clamp(v, lo=0, hi=10) { return Math.max(lo, Math.min(hi, v)); }
function pct100(x) { return Math.max(0, Math.min(100, Math.round(x))); }
function label(score100){ return score100>=90?'EXCELLENT':score100>=75?'GOOD':score100>=60?'AVERAGE':'NEEDS WORK'; }

export function generateScoreData(score, resume = {}, jobText = '') {
  const full = textFromResume(resume);

  // ---- Impact (incl. soft skills) ----
  const numbersCount = (full.match(/\b\d+(%|\+|x)?\b/g) || []).length;
  const uniqueWords  = new Set(full.split(/\W+/).filter(Boolean));
  const repetition   = 1 - uniqueWords.size / (full.split(/\W+/).filter(Boolean).length || 1);
  const weakHits     = WEAK_VERBS.reduce((a,w)=> a + (full.includes(w) ? 1 : 0), 0);

  const softPresence = SOFT_SKILLS.map(k => ({ name: k, present: full.includes(k) }));
  const softCovered  = softPresence.filter(s=>s.present).length;
  const softPct      = softCovered / SOFT_SKILLS.length; 
  const softScore10  = clamp(Math.round(softPct * 10));  

  const impactItems = [
    { name: 'Quantifying impact',   score: clamp(numbersCount >= 6 ? 10 : numbersCount * 2) },
    { name: 'Repetition',           score: clamp(10 - Math.round(repetition * 10)) },
    { name: 'Weak action verbs',    score: clamp(10 - weakHits * 2) },
    { name: 'Tenses',               score: 8 },
    { name: 'No responsibilities',  score: full.includes('responsible for') ? 7 : 10 },
    { name: 'Spelling',             score: 8 },
    { name: 'Soft skills coverage', score: softScore10 },
  ];
  const impact100 = pct100( impactItems.reduce((a,i)=>a+i.score,0) / (impactItems.length*10) * 100 );

  // ---- Brevity ----
  const words = full.split(/\s+/).filter(Boolean);
  const bullets = (full.match(/[•\-–]\s+/g) || []).length;
  const avgBulletLen = bullets ? Math.round(words.length / bullets) : words.length;
  const fillerHits   = FILLERS.reduce((a,w)=> a + (full.match(new RegExp(`\\b${w}\\b`, 'g')) || []).length, 0);

  const brevityItems = [
    { name: 'Resume length',        score: clamp(10 - Math.max(0, Math.round(words.length/300) - 1)) },
    { name: 'Total bullet points',  score: clamp(bullets >= 8 ? 10 : bullets + 2) },
    { name: 'Use of bullets',       score: bullets ? 10 : 5 },
    { name: 'Bullet point length',  score: clamp(10 - Math.floor((avgBulletLen - 20)/5)) },
    { name: 'Filler words',         score: clamp(10 - fillerHits) },
  ];
  const brevity100 = pct100( brevityItems.reduce((a,i)=>a+i.score,0) / (brevityItems.length*10) * 100 );

  // ---- Style ----
  const sectionsPresent = ['summary','experience','education','skills'].filter(s => full.includes(s)).length;
  const buzzHits = BUZZWORDS.reduce((a,w)=> a + (full.includes(w) ? 1 : 0), 0);
  const datesHits = (full.match(/\b(20\d{2}|201\d|202\d|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/g) || []).length;
  const pronounHits = (full.match(/\b(i|me|my)\b/g) || []).length;

  const styleItems = [
    { name: 'Sections',             score: clamp(sectionsPresent * 2 + 2) },
    { name: 'Buzzwords & clichés',  score: clamp(10 - buzzHits) },
    { name: 'Dates',                score: clamp(Math.min(10, Math.round(datesHits/2))) },
    { name: 'Personal pronouns',    score: clamp(10 - pronounHits) },
    { name: 'Active voice',         score: 8 },
    { name: 'Consistency',          score: 9 },
  ];
  const style100 = pct100( styleItems.reduce((a,i)=>a+i.score,0) / (styleItems.length*10) * 100 );

  // Expose top missing soft skills for the UI (chips in Impact panel)
  const softskillsMissing = softPresence.filter(s=>!s.present).map(s=>s.name);

  return {
    overall: score,
    breakdown: {
      impact:  { score: impact100,  label: label(impact100),  items: impactItems, softskillsMissing },
      brevity: { score: brevity100, label: label(brevity100), items: brevityItems },
      style:   { score: style100,   label: label(style100),   items: styleItems },
    },
  };
}
