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
export const generateScoreData = (score) => ({
  overall: score,
  totalIssues: Math.floor(Math.random() * 10), // example
  categories: {
    tailoring: { score: 100, status: 'good' },
    content: { score: Math.min(100, score), status: score >= 60 ? 'good' : 'warning' },
    format: { score: Math.min(100, score - 30 > 0 ? score - 30 : 20), status: score >= 50 ? 'good' : 'error' },
    sections: { score: 90, status: 'good' },
    style: { score: 85, status: 'good' }
  },
  issues: [
    { name: 'ATS Parse Rate', status: 'good', icon: '✓' },
    { name: 'Quantifying Impact', status: score < 60 ? 'warning' : 'good', icon: score < 60 ? '⚠' : '✓' },
    { name: 'Repetition', status: 'good', icon: '✓' },
    { name: 'Spelling & Grammar', status: score < 50 ? 'warning' : 'good', icon: score < 50 ? '⚠' : '✓' }
  ]
});
