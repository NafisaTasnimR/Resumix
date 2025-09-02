const toText = (v) => (typeof v === "string" ? v.toLowerCase() : "");

const blobFromResume = (rd = {}) => {
  const PI = rd.personalInfo || {};
  const EDU = Array.isArray(rd.education) ? rd.education : [];
  const EXP = Array.isArray(rd.experience) ? rd.experience : [];
  const SK = Array.isArray(rd.skills) ? rd.skills : [];
  const ACH = Array.isArray(rd.achievements) ? rd.achievements : [];
  const REF = Array.isArray(rd.references) ? rd.references : [];
  const PRJ = Array.isArray(rd.projects) ? rd.projects : [];
  const ADD = Array.isArray(rd.additionalInfos) ? rd.additionalInfos : [];

  return [
    PI.fullName, PI.professionalEmail, PI.address, PI.city, PI.district, PI.country, PI.phone,
    ...EDU.flatMap(e => [e.institution, e.degree, e.fieldOfStudy, e.description]),
    ...EXP.flatMap(e => [e.employerName, e.jobTitle, e.description]),
    ...SK.flatMap(s => [s.skillName, s.skillDescription]),
    ...ACH.flatMap(a => [a.title, a.organization, a.category, a.description]),
    ...PRJ.flatMap(p => [p.title, p.description, p.techStack]),
    ...ADD.flatMap(a => [a.sectionTitle, a.content]),
  ].filter(Boolean).map(toText).join(" ");
};

/** ---------------- Shared heuristics ---------------- */
const regex = {
  // numbers/percentages/currency + common "count nouns"
  metrics: /\b(\d+(\.\d+)?%|\$\s?\d[\d,]*|[0-9]{2,}\+?)\b|\b(users|requests|tickets|projects|clients|issues|orders|leads|repos|datasets)\b/i,
  // decent action verbs
  actionVerbs: /\b(led|built|designed|developed|implemented|launched|shipped|migrated|optimized|improved|reduced|increased|automated|integrated|deployed|scaled|architected|drove|owned)\b/i,
  // cheap passive-voice detector
  passiveVoice: /\b(was|were|is|are|been|being)\s+\w+ed\b/i,
};

const FILLER = [
  "really", "very", "various", "several", "many", "successfully", "effectively",
  "basically", "highly", "significantly", "quite", "fairly", "extremely", "remarkably"
];
const hasFiller = (text) => FILLER.some(w => text.includes(` ${w} `));

/** ---------------- Score (returns 0–100) ---------------- */
export const calculateAtsScore = (resumeData = {}) => {
  const clamp = (n, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, Math.round(n || 0)));

  const PI = resumeData.personalInfo || {};
  const EDU = Array.isArray(resumeData.education) ? resumeData.education : [];
  const EXP = Array.isArray(resumeData.experience) ? resumeData.experience : [];
  const SK = Array.isArray(resumeData.skills) ? resumeData.skills : [];
  const ACH = Array.isArray(resumeData.achievements) ? resumeData.achievements : [];
  const REF = Array.isArray(resumeData.references) ? resumeData.references : [];
  const PRJ = Array.isArray(resumeData.projects) ? resumeData.projects : [];
  const ADD = Array.isArray(resumeData.additionalInfos) ? resumeData.additionalInfos : [];

  const text = blobFromResume(resumeData);

  let score = 0;

  // Skills breadth
  if (SK.length >= 5) score += 17;
  if (SK.length >= 8) score += 3;
  if (SK.length >= 12) score += 2;

  // Skill proficiency/years
  if (SK.some(s => s?.proficiencyLevel || Number.isFinite(s?.yearsOfExperience))) score += 3;

  // Experience coverage
  if (EXP.length >= 1) score += 12;
  if (EXP.length >= 2) score += 15;
  if (EXP.some(e => e?.jobTitle)) score += 2;
  if (EXP.some(e => e?.isCurrentJob === true)) score += 3;

  // Tenure ≥ 6 months anywhere
  const sixMonths = 1000 * 60 * 60 * 24 * 30 * 6;
  const has6mTenure = EXP.some(e => {
    const start = e?.startDate ? new Date(e.startDate).getTime() : NaN;
    const end = e?.isCurrentJob ? Date.now() : (e?.endDate ? new Date(e.endDate).getTime() : NaN);
    return Number.isFinite(start) && Number.isFinite(end) && (end - start) >= sixMonths;
  });
  if (has6mTenure) score += 4;

  // Education
  if (EDU.length >= 1) score += 10;
  if (EDU.some(e => !!e?.degree)) score += 2;

  // Projects
  if (PRJ.length >= 1) score += 4;
  if (PRJ.length >= 2) score += 2;
  if (PRJ.length >= 3) score += 2;

  // Achievements
  if (ACH.length >= 1) score += 3;
  if (ACH.length >= 3) score += 2;

  // References & Extras
  if (REF.length >= 1) score += 2;
  if (ADD.length >= 1) score += 1;

  // Contact & location
  if (PI?.phone && String(PI.phone).trim().length >= 6) score += 3;
  if (PI?.city || PI?.country) score += 2;

  // Writing quality
  if (regex.metrics.test(text)) score += 4;
  if (regex.actionVerbs.test(text)) score += 3;
  if (!hasFiller(text)) score += 3;
  if (!regex.passiveVoice.test(text)) score += 4;
  if (!/\b(i|me|my|we|our)\b/i.test(text)) score += 3;

  return clamp(score, 0, 100);
};

/** ---------------- Suggestions (improvements ONLY) ----------------
 * Returns: { items: Array<{title,message,potentialGain,key}>, totalPotentialGain }
 */
export const generateSuggestions = (resumeData = {}) => {
  const PI = resumeData.personalInfo || {};
  const EDU = Array.isArray(resumeData.education) ? resumeData.education : [];
  const EXP = Array.isArray(resumeData.experience) ? resumeData.experience : [];
  const SK = Array.isArray(resumeData.skills) ? resumeData.skills : [];
  const ACH = Array.isArray(resumeData.achievements) ? resumeData.achievements : [];
  const REF = Array.isArray(resumeData.references) ? resumeData.references : [];
  const PRJ = Array.isArray(resumeData.projects) ? resumeData.projects : [];
  const ADD = Array.isArray(resumeData.additionalInfos) ? resumeData.additionalInfos : [];

  const text = blobFromResume(resumeData);

  const sixMonths = 1000 * 60 * 60 * 24 * 30 * 6;
  const has6mTenure = EXP.some(e => {
    const start = e?.startDate ? new Date(e.startDate).getTime() : NaN;
    const end = e?.isCurrentJob ? Date.now() : (e?.endDate ? new Date(e.endDate).getTime() : NaN);
    return Number.isFinite(start) && Number.isFinite(end) && (end - start) >= sixMonths;
  });

  const items = [];
  const add = (cond, key, title, message, potentialGain) => {
    if (cond) items.push({ key, title, message, potentialGain });
  };

  // Content/structure mapped to scoring
  add(!regex.metrics.test(text),
    'metrics',
    'Add measurable impact',
    "Work numbers into bullets (e.g., “Reduced API latency by 35%”, “Handled 120+ tickets/month”).",
    4);

  if (SK.length <= 3) {
    add(true,
      'skills_base',
      'List more role-aligned skills',
      'Aim for 6–10 focused hard skills (frameworks, tools) matching the target role.',
      17);
  } else if (SK.length < 8) {
    add(true,
      'skills_8',
      'Broaden the skills section',
      'Round out to ~8 skills; keep them tightly relevant.',
      3);
  } else if (SK.length < 12) {
    add(true,
      'skills_12',
      'Add a few more targeted skills',
      'If genuinely relevant, expand towards 10–12 total.',
      2);
  }

  add(!SK.some(s => s?.proficiencyLevel || Number.isFinite(s?.yearsOfExperience)),
    'skills_prof',
    'Show proficiency/years for key skills',
    "Add levels (e.g., “Advanced”) or years (e.g., “3 yrs”).",
    3);

  if (EXP.length === 0) {
    add(true,
      'exp_none',
      'Add professional experience',
      'Include internships, part-time roles, or substantial freelance projects treated like roles.',
      12);
  } else if (EXP.length === 1) {
    add(true,
      'exp_one_more',
      'Include another relevant experience',
      'Add one more role (internship/freelance OK) to show breadth.',
      15);
  }
  add(!EXP.some(e => !!e?.jobTitle),
    'exp_titles',
    'Provide job titles',
    'Ensure each role has a clear, standard title.',
    2);
  add(!EXP.some(e => e?.isCurrentJob === true),
    'exp_current',
    'Mark a current role (if applicable)',
    'If you are currently employed, flag the role as current.',
    3);
  add(!has6mTenure,
    'exp_tenure',
    'Clarify dates/tenure (≥ 6 months)',
    'Check start/end dates; short stints may need context or consolidation.',
    4);

  // Education
  if (EDU.length === 0) {
    add(true,
      'edu_add',
      'Add education',
      'Include your degree/program and institution.',
      10);
  } else {
    add(!EDU.some(e => !!e?.degree),
      'edu_degree',
      'Name the degree',
      'Spell out degree names (e.g., “B.Sc. in CSE”).',
      2);
  }

  // Projects
  if (PRJ.length === 0) add(true, 'proj_add', 'Add 1–2 projects', 'Include outcomes and tech stack.', 4);
  if (PRJ.length === 1) add(true, 'proj_second', 'Add one more project', 'Two concise, outcome-focused projects is a good baseline.', 2);
  if (PRJ.length === 2) add(true, 'proj_third', 'Consider a 3rd project (optional)', 'If it adds unique value, include a third.', 2);

  // Achievements
  if (ACH.length === 0) add(true, 'ach_add', 'Show 1–2 achievements/awards', 'Publications, scholarships, hackathons, competitions.', 3);
  if (ACH.length > 0 && ACH.length < 3) add(true, 'ach_round', 'Round out achievements', 'Target 2–3 concise achievements.', 2);

  // References / Extra
  add(REF.length === 0, 'ref_add', 'Include references (optional)', 'One line is enough (names/roles, contact if allowed).', 2);
  add(ADD.length === 0, 'extra_add', 'Add certifications/extra info', 'Licenses, languages, publications, portfolio link.', 1);

  // Contact & location
  add(!(PI.phone && String(PI.phone).trim().length >= 6),
    'contact_phone',
    'Add a phone number',
    'Use a reachable number with country code.',
    3);
  add(!(PI.city || PI.country),
    'contact_location',
    'Add location (city/country)',
    'Include at least city & country or “Open to relocation/remote”.',
    2);

  // Writing quality 
  add(!regex.actionVerbs.test(text),
    'write_verbs',
    'Start bullets with strong action verbs',
    'E.g., Developed, Built, Optimized, Migrated, Led, Automated.',
    3);
  add(hasFiller(text),
    'write_filler',
    'Remove filler words',
    'Trim vague adverbs (very, successfully, various). Keep bullets crisp.',
    3);
  add(regex.passiveVoice.test(text),
    'write_active',
    'Rewrite passive voice',
    'E.g., “API was developed …” → “Developed an API …”.',
    4);
  add(/\b(i|me|my|we|our)\b/i.test(text),
    'write_pronouns',
    'Remove first-person pronouns',
    'Use neutral, telegraphic style: bullets start with verbs.',
    3);

  // Order by impact (highest first)
  items.sort((a, b) => (b.potentialGain || 0) - (a.potentialGain || 0));

  const totalPotentialGain = items.reduce((s, it) => s + (it.potentialGain || 0), 0);
  return { items, totalPotentialGain };
};

export const __atsUtils = { blobFromResume, regex, hasFiller };
