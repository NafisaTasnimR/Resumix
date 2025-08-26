import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import QuestionBox from './QuestionBox';
import Preview from './Preview';
import ProgressLine from './ProgressLine';

/* ---------------------------------------------
   Field indexes (maps backend fields → question order)
---------------------------------------------- */
const FIELD_INDEX = {
  personal: { fullName: 0, professionalEmail: 1, dateOfBirth: 2, phone: 3, address: 4, city: 5, district: 6, country: 7, zipCode: 8 },
  education: { degree: 0, fieldOfStudy: 1, institution: 2, startDate: 3, endDate: 4, isCurrentEducation: 5, currentStatus: 5 },
  experience: { jobTitle: 0, employerName: 1, city: 2, state: 2, location: 2, startDate: 3, endDate: 4, isCurrentJob: 5, bullets: 6, responsibilities: 6 },
  skills: { skillName: 0, proficiencyLevel: 1, yearsOfExperience: 2, description: 3 },
  achievements: { title: 0, organization: 1, dateReceived: 2, category: 3, description: 4, website: 5 },
  references: { firstName: 0, lastName: 0, jobTitle: 1, company: 2, referenceEmail: 3, referencePhone: 4 },
  hobbies: { hobbyName: 0 },
  additional: { content: 0, sectionTitle: 0 }
};

/* ---------------------------------------------
   Questions per section
---------------------------------------------- */
const personalQuestions = ["Full Name?", "Professional Email?", "Date of Birth?", "Phone?", "Address?", "City?", "District?", "Country?", "Zip Code?"];
const educationQuestions = ["Your Degree?", "Your Field of Study?", "Your Institution?", "Start Date of Education?", "End Date of Education?", "Current Status of Education?"];
const experienceQuestions = ["Job Title?", "Employer Name?", "Job Location?", "Start Date of Job?", "End Date of Job?", "Is this your current job?", "Your Responsibilities?"];
const skillQuestions = ["Skill Name?", "Skill Proficiency?", "Years of Experience?", "Skills Description?"];
const achievementQuestions = ["Achievement Title?", "Organization (optional)?", "Date Received?", "Category (e.g., Award, Certification)?", "Description?", "Website (optional)?"];
const referenceQuestions = ["Referee Name?", "Referee Designation?", "Referee Organization?", "Referee Email?", "Referee Phone?"];
const hobbyQuestions = ["Your Hobbies?"];
const additionalInfoQuestions = ["Additional Information?"];

const SECTION_LIST = [
  { key: "personal", label: "Personal", repeatable: false, qs: personalQuestions },
  { key: "education", label: "Education", repeatable: true, qs: educationQuestions },
  { key: "experience", label: "Experience", repeatable: true, qs: experienceQuestions },
  { key: "skills", label: "Skills", repeatable: true, qs: skillQuestions },
  { key: "achievements", label: "Achievements", repeatable: true, qs: achievementQuestions },
  { key: "references", label: "References", repeatable: true, qs: referenceQuestions },
  { key: "hobbies", label: "Hobbies", repeatable: true, qs: hobbyQuestions },
  { key: "additional", label: "Additional", repeatable: true, qs: additionalInfoQuestions },
];

/* ---------------------------------------------
   Helpers to map backend → QuestionBox answers
---------------------------------------------- */
const yesNo = (b) => (b ? 'Yes' : 'No');
const fmtDate = (d) => {
  if (!d) return '';
  const x = new Date(d);
  return Number.isNaN(x.getTime()) ? '' : x.toISOString().slice(0, 10); // yyyy-mm-dd
};

// produce one answers[] matching qs order using a field map
const fillAnswersFromObject = (qs, map, obj) => {
  const ans = Array(qs.length).fill('');
  Object.entries(map).forEach(([field, idx]) => {
    if (!obj) return;
    let v = obj[field];

    // special cases/aliases
    if (field === 'isCurrentEducation' || field === 'currentStatus') {
      const b = obj.isCurrentEducation ?? obj.isCurrentInstitution ?? obj.isCurrentInstitute ?? obj.isCurrent ?? false;
      v = yesNo(!!b);
    }
    if (field === 'location') {
      const city = obj.city || '';
      const state = obj.state || '';
      v = [city, state].filter(Boolean).join(', ');
    }
    if (field === 'bullets' || field === 'responsibilities') {
      v = obj.description || obj.responsibilities || '';
    }
    if (field.toLowerCase().includes('date')) {
      v = fmtDate(v);
    }
    if (typeof v === 'boolean') v = yesNo(v);

    if (v != null) ans[idx] = String(v);
  });
  return ans;
};

// build entries (array of answers[]) from array of objects for a section
const buildEntries = (sectionKey, qs, map, arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return [Array(qs.length).fill('')];

  // references: merge first+last into "Referee Name?"
  if (sectionKey === 'references') {
    const nameIdx = map.firstName;
    if (nameIdx !== undefined) {
      return arr.map((o) => {
        const base = fillAnswersFromObject(qs, map, o);
        base[nameIdx] = [o.firstName, o.lastName].filter(Boolean).join(' ').trim();
        return base;
      });
    }
  }

  return arr.map((o) => fillAnswersFromObject(qs, map, o));
};

const initEntry = (qs) => Array(qs.length).fill("");
const makeInitialEntries = () => ({
  personal: [initEntry(personalQuestions)],
  education: [initEntry(educationQuestions)],
  experience: [initEntry(experienceQuestions)],
  skills: [initEntry(skillQuestions)],
  achievements: [initEntry(achievementQuestions)],
  references: [initEntry(referenceQuestions)],
  hobbies: [initEntry(hobbyQuestions)],
  additional: [initEntry(additionalInfoQuestions)],
});
const makeInitialEntryIdx = () => ({
  personal: 0, education: 0, experience: 0, skills: 0,
  achievements: 0, references: 0, hobbies: 0, additional: 0,
});

/* ---------------------------------------------
   Component
---------------------------------------------- */
const ResumeEditor = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // preview/template state (from Templates flow by default)
  const [templateHtml, setTemplateHtml] = useState(location.state?.rawTemplate || "");
  const [templateCss, setTemplateCss] = useState(location.state?.templateCss || "");
  const [title, setTitle] = useState(location.state?.templateName || "Untitled");
  const [templateId, setTemplateId] = useState(null);

  // progress dropdown
  const [progressOpen, setProgressOpen] = useState(true);

  // section + question positions
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

  // answers: per-section arrays of entries; each entry is an answers[] in question order
  const [entriesBySection, setEntriesBySection] = useState(makeInitialEntries);
  const [entryIndexBySection, setEntryIndexBySection] = useState(makeInitialEntryIdx);

  const [saving, setSaving] = useState(false);
  const isEditMode = Boolean(location.state?.resumeId);

  const currentSection = SECTION_LIST[currentSectionIdx];
  const currKey = currentSection.key;
  const currEntries = entriesBySection[currKey];
  const currEntryIdx = entryIndexBySection[currKey];
  const currAnswers = currEntries[currEntryIdx];

  /* ---------------------------------------------
     Seed from Templates → user's defaultResumeData
  ---------------------------------------------- */
  useEffect(() => {
    const cameFromTemplates =
      !!location.state?.rawTemplate && !location.state?.resumeId;

    if (!cameFromTemplates) return;

    const loadDefault = async () => {
      try {
        const res = await axios.get('http://localhost:5000/viewInformation/userInformation', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` }
        });
        const d = res?.data?.defaultResumeData || {};

        const personalAns = fillAnswersFromObject(personalQuestions, FIELD_INDEX.personal, d.personalInfo || {});
        const eduEntries = buildEntries('education', educationQuestions, FIELD_INDEX.education, d.education || []);
        const expEntries = buildEntries('experience', experienceQuestions, FIELD_INDEX.experience, d.experience || []);
        const sklEntries = buildEntries('skills', skillQuestions, FIELD_INDEX.skills, d.skills || []);
        const achEntries = buildEntries('achievements', achievementQuestions, FIELD_INDEX.achievements, d.achievements || []);
        const refEntries = buildEntries('references', referenceQuestions, FIELD_INDEX.references, d.references || []);
        const hobEntries = buildEntries('hobbies', hobbyQuestions, FIELD_INDEX.hobbies, d.hobbies || []);
        const addEntries = Array.isArray(d.additionalInfos) && d.additionalInfos.length
          ? d.additionalInfos.map(info => {
            const a = Array(additionalInfoQuestions.length).fill('');
            a[0] = info.content || info.sectionTitle || '';
            return a;
          })
          : [Array(additionalInfoQuestions.length).fill('')];

        setEntriesBySection({
          personal: [personalAns],
          education: eduEntries,
          experience: expEntries,
          skills: sklEntries,
          achievements: achEntries,
          references: refEntries,
          hobbies: hobEntries,
          additional: addEntries,
        });

        setEntryIndexBySection(makeInitialEntryIdx());
        setCurrentSectionIdx(0);
        setCurrentQuestionIdx(0);
      } catch (e) {
        console.error('Failed to load defaultResumeData', e);
      }
    };

    loadDefault();
  }, [location.state]);

  /* ---------------------------------------------
     Edit flow → load Resume by id + its template
  ---------------------------------------------- */
  useEffect(() => {
    const resumeId = location.state?.resumeId;
    if (!resumeId) return;

    const token = localStorage.getItem("token") || "";

    (async () => {
      try {
        // 1) fetch the resume
        const { data } = await axios.get(`http://localhost:5000/resume/${resumeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (data?.title) setTitle(data.title);
        if (data?.templateId) setTemplateId(data.templateId);

        const rd = data?.ResumeData || {};
        const personal = rd.personalInfo || {};

        // map each section
        const personalAns = [
          personal.fullName || "",
          personal.professionalEmail || "",
          fmtDate(personal.dateOfBirth),
          personal.phone || "",
          personal.address || "",
          personal.city || "",
          personal.district || "",
          personal.country || "",
          personal.zipCode || "",
        ];
        const eduEntries = (rd.education || []).map(e => ([
          e.degree || "",
          e.fieldOfStudy || "",
          e.institution || "",
          fmtDate(e.startDate),
          fmtDate(e.endDate || e.graduationDate),
          e.isCurrentInstitute ? "Yes" : "No",
        ]));
        const expEntries = (rd.experience || []).map(x => ([
          x.jobTitle || "",
          x.employerName || "",
          [x.city, x.state].filter(Boolean).join(", "),
          fmtDate(x.startDate),
          fmtDate(x.endDate),
          x.isCurrentJob ? "Yes" : "No",
          "", // responsibilities placeholder
        ]));
        const sklEntries = (rd.skills || []).map(s => ([
          s.skillName || "",
          s.proficiencyLevel || "",
          (s.yearsOfExperience ?? "").toString(),
          s.skillDescription || "",
        ]));
        const achEntries = (rd.achievements || []).map(a => ([
          a.title || "",
          a.organization || "",
          fmtDate(a.dateReceived),
          a.category || "",
          a.description || "",
          a.website || "",
        ]));
        const refEntries = (rd.references || []).map(r => ([
          [r.firstName, r.lastName].filter(Boolean).join(" ").trim(),
          r.jobTitle || "",
          r.company || "",
          r.referenceEmail || "",
          r.phone || "",
        ]));
        const hobEntries = (rd.hobbies || []).map(h => ([
          h.hobbyName || h.description || "",
        ]));
        const addEntries = (rd.additionalInfos || []).map(a => ([
          a.content || a.sectionTitle || "",
        ]));

        setEntriesBySection(prev => ({
          ...prev,
          personal: [personalAns],
          education: eduEntries.length ? eduEntries : prev.education,
          experience: expEntries.length ? expEntries : prev.experience,
          skills: sklEntries.length ? sklEntries : prev.skills,
          achievements: achEntries.length ? achEntries : prev.achievements,
          references: refEntries.length ? refEntries : prev.references,
          hobbies: hobEntries.length ? hobEntries : prev.hobbies,
          additional: addEntries.length ? addEntries : prev.additional,
        }));
        setEntryIndexBySection(makeInitialEntryIdx());

        // 2) fetch template parts by templateId (for initial preview)
        if (data?.templateId) {
          const parts = await axios.get(`http://localhost:5000/preview/api/template/parts/${data.templateId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setTemplateHtml(parts.data?.rawTemplate || "");
          setTemplateCss(parts.data?.templateCss || "");
        }
      } catch (err) {
        console.error("Failed to load resume/template for edit", err);
      }
    })();
  }, [location.state?.resumeId]);

  /* ---------------------------------------------
     Title editing
  ---------------------------------------------- */
  const [titleDropdownOpen, setTitleDropdownOpen] = useState(false);
  const toggleTitleEdit = () => setTitleDropdownOpen(!titleDropdownOpen);
  const saveTitle = (e) => {
    e.stopPropagation();
    const value = document.getElementById('titleInput').value;
    setTitle(value || 'Untitled');
    setTitleDropdownOpen(false);
  };

  /* ---------------------------------------------
     Preview → click to focus specific section/field
  ---------------------------------------------- */
  const handleSectionClick = (payload) => {
    const sectionKey = typeof payload === "string" ? payload : payload?.section;
    const field = typeof payload === "string" ? undefined : payload?.field;

    const idx = SECTION_LIST.findIndex(s => s.key === sectionKey);
    const safeIdx = idx >= 0 ? idx : 0;
    setCurrentSectionIdx(safeIdx);

    const idxMap = FIELD_INDEX[sectionKey] || {};
    const nextQ = (field && Object.prototype.hasOwnProperty.call(idxMap, field)) ? idxMap[field] : 0;
    setCurrentQuestionIdx(nextQ);
  };

  /* ---------------------------------------------
     Question edit handlers
  ---------------------------------------------- */
  const handleAnswerChange = (value) => {
    setEntriesBySection(prev => {
      const copy = { ...prev };
      const list = copy[currKey].map(arr => [...arr]); // shallow-clone entries
      list[currEntryIdx][currentQuestionIdx] = value;
      copy[currKey] = list;
      return copy;
    });
  };

  // cross-section navigation
  const onSectionNext = () => {
    if (currentSectionIdx < SECTION_LIST.length - 1) {
      setCurrentSectionIdx(i => i + 1);
      setCurrentQuestionIdx(0);
    }
  };
  const onSectionPrev = () => {
    if (currentSectionIdx > 0) {
      const prevIdx = currentSectionIdx - 1;
      setCurrentSectionIdx(prevIdx);
      const lastQ = SECTION_LIST[prevIdx].qs.length - 1;
      setCurrentQuestionIdx(Math.max(lastQ, 0));
    }
  };

  // add/remove one instance (entry) of current section
  const onAddEntry = () => {
    if (!currentSection.repeatable) return;
    setEntriesBySection(prev => {
      const copy = { ...prev };
      copy[currKey] = [...copy[currKey], initEntry(currentSection.qs)];
      return copy;
    });
    setEntryIndexBySection(prev => ({ ...prev, [currKey]: currEntries.length }));
    setCurrentQuestionIdx(0);
  };
  const onRemoveEntry = () => {
    if (!currentSection.repeatable) return;
    const total = currEntries.length;
    if (total > 1) {
      setEntriesBySection(prev => {
        const copy = { ...prev };
        const list = [...copy[currKey]];
        list.splice(currEntryIdx, 1);
        copy[currKey] = list;
        return copy;
      });
      setEntryIndexBySection(prev => ({ ...prev, [currKey]: Math.max(0, currEntryIdx - 1) }));
      setCurrentQuestionIdx(0);
    } else {
      setEntriesBySection(prev => {
        const copy = { ...prev };
        copy[currKey] = [initEntry(currentSection.qs)];
        return copy;
      });
      setCurrentQuestionIdx(0);
    }
  };

  // entry pager within a repeatable section
  const onPrevEntry = () => {
    if (!currentSection.repeatable) return;
    if (currEntryIdx > 0) {
      setEntryIndexBySection(prev => ({ ...prev, [currKey]: currEntryIdx - 1 }));
      setCurrentQuestionIdx(0);
    }
  };
  const onNextEntry = () => {
    if (!currentSection.repeatable) return;
    if (currEntryIdx < currEntries.length - 1) {
      setEntryIndexBySection(prev => ({ ...prev, [currKey]: currEntryIdx + 1 }));
      setCurrentQuestionIdx(0);
    }
  };
  const hasNextSection = currentSectionIdx < SECTION_LIST.length - 1;
  const hasPrevSection = currentSectionIdx > 0;
  const canAdd = !!currentSection.repeatable;
  const canRemove = !!currentSection.repeatable && currEntries.length >= 1;
  const canPrevEntry = currentSection.repeatable && currEntries.length > 1 && currEntryIdx > 0;
  const canNextEntry = currentSection.repeatable && currEntries.length > 1 && currEntryIdx < currEntries.length - 1;

  /* ---------------------------------------------
     Convert answers → ResumeData (schema shape)
  ---------------------------------------------- */
  const toBool = (s) => typeof s === 'string' ? /^y(es)?$/i.test(s.trim()) : !!s;
  const parseCityState = (s = '') => {
    const [city, state] = String(s).split(',').map(t => t.trim());
    return { city: city || '', state: state || '' };
  };
  const curr = (all, secKey, entryIdx, qIdx) => {
    const list = all?.[secKey] || [];
    const entry = list?.[entryIdx] || [];
    return entry?.[qIdx] || '';
  };

  const resumeData = useMemo(() => {
    const data = {
      personalInfo: {
        fullName: curr(entriesBySection, 'personal', 0, FIELD_INDEX.personal.fullName),
        professionalEmail: curr(entriesBySection, 'personal', 0, FIELD_INDEX.personal.professionalEmail),
        dateOfBirth: curr(entriesBySection, 'personal', 0, FIELD_INDEX.personal.dateOfBirth),
        phone: curr(entriesBySection, 'personal', 0, FIELD_INDEX.personal.phone),
        address: curr(entriesBySection, 'personal', 0, FIELD_INDEX.personal.address),
        city: curr(entriesBySection, 'personal', 0, FIELD_INDEX.personal.city),
        district: curr(entriesBySection, 'personal', 0, FIELD_INDEX.personal.district),
        country: curr(entriesBySection, 'personal', 0, FIELD_INDEX.personal.country),
        zipCode: curr(entriesBySection, 'personal', 0, FIELD_INDEX.personal.zipCode),
      },
      education: (entriesBySection.education || [])
        .map(ans => {
          const startDate = ans[FIELD_INDEX.education.startDate] || '';
          const endDate = ans[FIELD_INDEX.education.endDate] || '';
          const isCurrent = toBool(ans[FIELD_INDEX.education.isCurrentEducation]);
          return {
            degree: ans[FIELD_INDEX.education.degree] || '',
            fieldOfStudy: ans[FIELD_INDEX.education.fieldOfStudy] || '',
            institution: ans[FIELD_INDEX.education.institution] || '',
            startDate,
            endDate: endDate || undefined,
            graduationDate: !endDate ? undefined : endDate,
            isCurrentInstitute: isCurrent,
            city: '', state: ''
          };
        })
        .filter(obj => Object.values(obj).some(v => v && String(v).trim() !== '')),
      experience: (entriesBySection.experience || [])
        .map(ans => {
          const loc = parseCityState(ans[FIELD_INDEX.experience.location] || '');
          return {
            jobTitle: ans[FIELD_INDEX.experience.jobTitle] || '',
            employerName: ans[FIELD_INDEX.experience.employerName] || '',
            city: loc.city,
            state: loc.state,
            startDate: ans[FIELD_INDEX.experience.startDate] || '',
            endDate: ans[FIELD_INDEX.experience.endDate] || '',
            isCurrentJob: toBool(ans[FIELD_INDEX.experience.isCurrentJob]),
          };
        })
        .filter(obj => Object.values(obj).some(v => v && String(v).trim() !== '')),
      skills: (entriesBySection.skills || [])
        .map(ans => ({
          skillName: ans[FIELD_INDEX.skills.skillName] || '',
          proficiencyLevel: ans[FIELD_INDEX.skills.proficiencyLevel] || '',
          yearsOfExperience: ans[FIELD_INDEX.skills.yearsOfExperience]
            ? Number(ans[FIELD_INDEX.skills.yearsOfExperience]) : undefined,
          skillDescription: ans[FIELD_INDEX.skills.description] || '',
        }))
        .filter(obj => Object.values(obj).some(v => v && String(v).trim() !== '')),
      achievements: (entriesBySection.achievements || [])
        .map(ans => ({
          title: ans[FIELD_INDEX.achievements.title] || '',
          organization: ans[FIELD_INDEX.achievements.organization] || '',
          dateReceived: ans[FIELD_INDEX.achievements.dateReceived] || '',
          category: ans[FIELD_INDEX.achievements.category] || '',
          description: ans[FIELD_INDEX.achievements.description] || '',
          website: ans[FIELD_INDEX.achievements.website] || '',
        }))
        .filter(obj => Object.values(obj).some(v => v && String(v).trim() !== '')),
      references: (entriesBySection.references || [])
        .map(ans => {
          const full = (ans[FIELD_INDEX.references.firstName] || '').trim();
          const parts = full.split(/\s+/);
          const lastName = parts.length > 1 ? parts.pop() : '';
          const firstName = parts.join(' ');
          return {
            firstName, lastName,
            jobTitle: ans[FIELD_INDEX.references.jobTitle] || '',
            company: ans[FIELD_INDEX.references.company] || '',
            referenceEmail: ans[FIELD_INDEX.references.referenceEmail] || '',
            phone: ans[FIELD_INDEX.references.referencePhone] || '',
            permissionToContact: false,
          };
        })
        .filter(obj => Object.values(obj).some(v => v && String(v).trim() !== '')),
      hobbies: (entriesBySection.hobbies || [])
        .map(ans => ({
          hobbyName: ans[FIELD_INDEX.hobbies.hobbyName] || '',
        }))
        .filter(obj => Object.values(obj).some(v => v && String(v).trim() !== '')),
      additionalInfos: (entriesBySection.additional || [])
        .map(ans => ({
          sectionTitle: '',
          content: ans[FIELD_INDEX.additional.content] || '',
        }))
        .filter(obj => (obj.content || '').trim() !== ''),
      projects: []
    };
    return data;
  }, [entriesBySection]);

  // saving state to prevent duplicate requests

  // create vs. save button handlers
  // create: from Templates flow (no resumeId in location.state)
  const handleCreate = async () => {
    if (saving) return;
    try {
      setSaving(true);
      const token = localStorage.getItem('token') || '';

      // Schema-only payload and correct template source
      const payload = {
        userEmail: (location.state?.userEmail ?? localStorage.getItem('userEmail') ?? localStorage.getItem('email') ?? ''),
        templateId: (location.state?.templateId ?? templateId),
        title: title || 'Untitled',
        ResumeData: resumeData,
      };

      await axios.post(
        'http://localhost:5000/resume/create',
        payload,
        { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
      );
      navigate(`/dashboard`);
    } catch (err) {
      console.error('Create failed:', err);
      alert('Failed to create resume.');
    } finally {
      setSaving(false);
    }
  };
  const handleSave = async () => {
    if (saving) return;
    try {
      setSaving(true);
      const token = localStorage.getItem('token') || '';
      const resumeId = location.state?.resumeId;

      const payload = {
        title: title || 'Untitled',
        // Include templateId so switching templates is persisted
        templateId: (location.state?.templateId ?? templateId),
        ResumeData: resumeData,
      };

      await axios.patch(
        `http://localhost:5000/resume/updateResume/${resumeId}`,
        payload,
        { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
      );

      alert('Changes saved.');
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };


  /* ---------------------------------------------
     Render
  ---------------------------------------------- */
  return (
    <div className='resume-editor'>
      <div className="main">
        <div className="title-edit">
          <div className="title-edit-bar" onClick={toggleTitleEdit}>
            <span className="title-text" id="titleDisplay">{title}</span>
            <button className="arrow-btn">{titleDropdownOpen ? '▲' : '▼'}</button>
          </div>
          {titleDropdownOpen && (
            <div className="title-edit-dropdown active" id="titleDropdown">
              <input type="text" id="titleInput" defaultValue={title} />
              <button className="edit-btn1" onClick={saveTitle}>Edit</button>
            </div>
          )}
        </div>

        {/* section-based progress line with dropdown */}
        <div className="progress">
          <div className="progress-line-header" onClick={() => setProgressOpen(o => !o)}>
            <span className="progress-title">Progress Line</span>
            <button className="arrow-btn-progress">{progressOpen ? "▲" : "▼"}</button>
          </div>
          <ProgressLine items={SECTION_LIST} current={currentSectionIdx} open={progressOpen} />
        </div>

        {/* Questions for CURRENT ENTRY of CURRENT SECTION */}
        <QuestionBox
          questions={currentSection.qs}
          current={currentQuestionIdx}
          setCurrent={setCurrentQuestionIdx}
          answers={currAnswers}
          onAnswerChange={handleAnswerChange}

          // repeatable controls
          onAddEntry={onAddEntry}
          onRemoveEntry={onRemoveEntry}
          canAdd={canAdd}
          canRemove={canRemove}

          // entry pager
          sectionLabel={currentSection.label}
          entryIndex={currEntryIdx}
          entryCount={currEntries.length}
          onPrevEntry={onPrevEntry}
          onNextEntry={onNextEntry}
          canPrevEntry={canPrevEntry}
          canNextEntry={canNextEntry}

          // cross-section behavior
          hasNextSection={hasNextSection}
          hasPrevSection={hasPrevSection}
          onSectionNext={onSectionNext}
          onSectionPrev={onSectionPrev}

          actionLabel={isEditMode ? 'Save' : 'Create'}
          onAction={isEditMode ? handleSave : handleCreate}
          actionDisabled={saving}
          actionTitle={isEditMode ? 'Save changes to this resume' : 'Create this resume'}
        />
      </div>

      {/* Live preview (server when templateId exists; DOM fill via data-edit-id otherwise) */}
      <Preview
        templateId={templateId}
        rawTemplate={templateHtml}
        templateCss={templateCss}
        resumeData={resumeData}
        onSectionClick={handleSectionClick}
      />
    </div>
  );
};

export default ResumeEditor;
