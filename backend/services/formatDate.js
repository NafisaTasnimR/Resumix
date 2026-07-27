

function fmt(d, style = 'medium') {
  if (!d) return null;
  const date = (d instanceof Date) ? d : new Date(d);
  // "short" => 6/17/25, "medium" => Jun 17, 2025, "month" => Jun 2025
  if (style === 'month') return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
}

// Walk through your nested ResumeData and stringify all dates once
function formatResumeForClient(resume) {
  if (!resume?.ResumeData) return resume;
  const r = JSON.parse(JSON.stringify(resume)); // safe clone of lean object

  const fixRange = (o = {}) => {
    o.startDateFormatted = fmt(o.startDate, 'month');
    o.endDateFormatted   = o.endDate ? fmt(o.endDate, 'month') : 'Present';
    return o;
  };

  // Adjust these paths to match your actual schema
  r.ResumeData.education?.forEach(e => fixRange(e));
  r.ResumeData.experience?.forEach(e => fixRange(e));
  r.ResumeData.projects?.forEach(p => fixRange(p));

  return r;
}

module.exports = { fmt, formatResumeForClient };
