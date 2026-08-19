

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
