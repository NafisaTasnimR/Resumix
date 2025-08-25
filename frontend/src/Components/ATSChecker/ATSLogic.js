// atsLogic.js (tightened scale)

/**
 * Calculate overall resume score (0–100).
 * Leaner weights so 100 is hard to reach.
 */
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

  const toText = (v) => (typeof v === 'string' ? v.toLowerCase() : '');
  const blob = [
    PI.fullName, PI.professionalEmail, PI.address, PI.city, PI.district, PI.country,
    ...EDU.flatMap(e => [e.institution, e.degree, e.fieldOfStudy]),
    ...EXP.flatMap(e => [e.employerName, e.jobTitle]),
    ...SK.flatMap(s => [s.skillName, s.skillDescription]),
    ...ACH.flatMap(a => [a.title, a.organization, a.category, a.description]),
    ...PRJ.flatMap(p => [p.title, p.description]),
    ...ADD.flatMap(a => [a.sectionTitle, a.content]),
  ].filter(Boolean).map(toText).join(' ');

  let score = 0;

  /* ========= Base (reduced) ========= */
  if (PI?.fullName) score += 10;                                   
  if (PI?.professionalEmail?.includes('@')) score += 8;          
  if (SK.length > 3) score += 17;                                 
  if (EXP.length > 1) score += 15;                                 
  if (EDU.length > 1) score += 10;                                 

  /* ========= Boosters ========= */
  if (PI?.phone && String(PI.phone).trim().length >= 6) score += 3;
  if (PI?.city || PI?.country) score += 2;

  const hasDetailInSkills = SK.some(s => s?.proficiencyLevel || Number.isFinite(s?.yearsOfExperience));
  if (hasDetailInSkills) score += 3;
  if (SK.length >= 3) score += 3;                 
  if (SK.length >= 5) score += 2;              

  const hasCurrentJob = EXP.some(e => e?.isCurrentJob === true);
  const hasTitles     = EXP.some(e => !!e?.jobTitle);
  if (hasCurrentJob) score += 5;
  if (hasTitles) score += 4;

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
  if (ACH.length >= 3) score += 5;

  if (REF.length >= 1) score += 2;
  if (ADD.length >= 1) score += 3;

  // Impact-y language 
  const hasNumbersOrPercent = /\b(\d+%|\d+\.\d+%|\b\d{1,3}\b)\b/.test(blob);
  if (hasNumbersOrPercent) score += 3;
  const hasActionVerbs = /(led|built|designed|developed|shipped|launched|optimized|automated|mentored)/.test(blob);
  if (hasActionVerbs) score += 2;

  /* ========= Penalties ========= */
  const penalize = (n) => { score -= Math.abs(n); };

  if (SK.length === 0) penalize(10);       
  if (EXP.length === 0) penalize(12);      
  if (blob.includes('responsible for')) penalize(3);
  if (!PI?.phone && (SK.length > 0 || EXP.length > 0)) penalize(3); 

  /* ========= Final clamp ========= */
  return clamp(score, 0, 100);
};