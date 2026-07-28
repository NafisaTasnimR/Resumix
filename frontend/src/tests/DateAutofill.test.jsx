/**
 * TODO-4: Information page automatically populates Date of Birth in
 *         Personal Information page when left blank (Medium, due 20 Aug 2026)
 * TODO-5: Experience section automatically sets identical Start Date and
 *         End Date when left blank (Medium, due 20 Aug 2026)
 * TODO-6: Education section automatically populates Graduation Date when
 *         left blank (Medium, due 20 Aug 2026)
 *
 * Investigation notes (see also backend/tests/todo.personal-info-required.test.js):
 * - frontend/src/Components/ProfileForm/ProfileForm.jsx already guards blank
 *   dates correctly on both the save path (line ~657: `personalInfo.dateOfBirth
 *   ? new Date(...) : null`) and its local `formatDate` load helper (line
 *   ~736: `if (!date) return ''`).
 * - frontend/src/Components/ResumeEditorPage/ResumeEditor.jsx's `fmtDate`
 *   helper (line ~47-51) also has the `if (!d) return ''` guard.
 * - Neither PersonalInfo.jsx, Experience.jsx nor Education.jsx (pure/controlled
 *   inputs) default date values themselves.
 * => The auto-population most likely happens either (a) in the backend
 *    (Mongoose casting an empty string sent from an older/other client code
 *    path to a non-null Date), or (b) in a resume-loading code path not yet
 *    inspected. These are captured as `test.todo` until the exact code path
 *    is confirmed, so the suite stays honest (no test asserting behavior we
 *    haven't actually verified is buggy).
 */

describe('TODO-4/5/6: blank dates should stay blank, never auto-filled', () => {
  test.todo(
    'TODO-4: submitting the Personal Information form with Date of Birth left blank, then reloading /profile, should show an empty Date of Birth field (not a default/epoch/today date)'
  );

  test.todo(
    'TODO-5: adding an Experience entry with Start Date filled and End Date left blank (not marked "Current Job") should keep End Date empty, not mirror Start Date'
  );

  test.todo(
    'TODO-6: adding an Education entry with no Graduation Date should keep it empty after save/reload, not default to another date field'
  );

  test.todo(
    'root-cause check: PATCH /info/update with { personalInfo: { dateOfBirth: null } } followed by GET /viewInformation/userInformation should round-trip dateOfBirth as null, not a default date (see backend/models/User.js defaultResumeData.personalInfo.dateOfBirth)'
  );
});
