
function updateExperienceLikeProfileForm(experiences, currentExperienceIndex, field, value) {
  const updatedExperiences = [...experiences];
  updatedExperiences[currentExperienceIndex] = {
    ...updatedExperiences[currentExperienceIndex],
    [field]: value,
  };
  return updatedExperiences;
}

function updateEducationLikeProfileForm(educations, currentEducationIndex, field, value) {
  const updatedEducations = [...educations];
  updatedEducations[currentEducationIndex] = {
    ...updatedEducations[currentEducationIndex],
    [field]: value,
  };
  return updatedEducations;
}


const makeExperience = (overrides = {}) => ({
  id: 1,
  employerName: '',
  jobTitle: '',
  city: '',
  state: '',
  startDate: '',
  endDate: '',
  isCurrentJob: false,
  description: '',
  ...overrides,
});

const makeEducation = (overrides = {}) => ({
  id: 1,
  institution: '',
  degree: '',
  fieldOfStudy: '',
  graduationDate: '',
  city: '',
  state: '',
  startDate: '',
  endDate: '',
  isCurrentInstitution: false,
  ...overrides,
});

describe('BUG: multiple experiences can be marked as current job', () => {
  test('BUG REPRO: marking a second experience as current does not unmark the first', () => {
    let experiences = [
      makeExperience({ id: 1, employerName: 'Company A', isCurrentJob: true }),
      makeExperience({ id: 2, employerName: 'Company B', isCurrentJob: false }),
    ];

   
    experiences = updateExperienceLikeProfileForm(experiences, 1, 'isCurrentJob', true);

    const currentJobs = experiences.filter((e) => e.isCurrentJob === true);

    
    expect(currentJobs).toHaveLength(1);
  });

  test('BUG REPRO: three experiences can all end up marked as current job', () => {
    let experiences = [
      makeExperience({ id: 1, employerName: 'A' }),
      makeExperience({ id: 2, employerName: 'B' }),
      makeExperience({ id: 3, employerName: 'C' }),
    ];

    experiences = updateExperienceLikeProfileForm(experiences, 0, 'isCurrentJob', true);
    experiences = updateExperienceLikeProfileForm(experiences, 1, 'isCurrentJob', true);
    experiences = updateExperienceLikeProfileForm(experiences, 2, 'isCurrentJob', true);

    const currentJobs = experiences.filter((e) => e.isCurrentJob === true);
    expect(currentJobs.length).toBeLessThanOrEqual(1);
  });
});

describe('BUG: multiple institutions can be marked as current institution', () => {
  test('BUG REPRO: marking a second institution as current does not unmark the first', () => {
    let educations = [
      makeEducation({ id: 1, institution: 'University A', isCurrentInstitution: true }),
      makeEducation({ id: 2, institution: 'University B', isCurrentInstitution: false }),
    ];

    educations = updateEducationLikeProfileForm(educations, 1, 'isCurrentInstitution', true);

    const currentInstitutions = educations.filter((e) => e.isCurrentInstitution === true);

     
    expect(currentInstitutions).toHaveLength(1);
  });

  test('BUG REPRO: three institutions can all end up marked as current', () => {
    let educations = [
      makeEducation({ id: 1, institution: 'A' }),
      makeEducation({ id: 2, institution: 'B' }),
      makeEducation({ id: 3, institution: 'C' }),
    ];

    educations = updateEducationLikeProfileForm(educations, 0, 'isCurrentInstitution', true);
    educations = updateEducationLikeProfileForm(educations, 1, 'isCurrentInstitution', true);
    educations = updateEducationLikeProfileForm(educations, 2, 'isCurrentInstitution', true);

    const currentInstitutions = educations.filter((e) => e.isCurrentInstitution === true);
    expect(currentInstitutions.length).toBeLessThanOrEqual(1);
  });
});

describe('Sanity checks (should already pass)', () => {
  test('only the targeted experience is otherwise modified', () => {
    let experiences = [
      makeExperience({ id: 1, employerName: 'Untouched Co' }),
      makeExperience({ id: 2, employerName: 'Target Co' }),
    ];
    experiences = updateExperienceLikeProfileForm(experiences, 1, 'jobTitle', 'Engineer');
    expect(experiences[0].employerName).toBe('Untouched Co');
    expect(experiences[1].jobTitle).toBe('Engineer');
  });
});