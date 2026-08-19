
import { calculateAtsScore, generateSuggestions } from '../Components/ATSChecker/ATSLogic';

describe('ATS Logic - score + suggestion total should never exceed 100', () => {
  const sumExceeds100 = (resumeData) => {
    const score = calculateAtsScore(resumeData);
    const { totalPotentialGain } = generateSuggestions(resumeData);
    return { score, totalPotentialGain, sum: score + totalPotentialGain };
  };

  test('BUG REPRO: a realistic partially-filled resume yields score + potentialGain > 100', () => {
    const resumeData = {
      personalInfo: { phone: '12345678', city: 'Dhaka' },
      skills: [
        { skillName: 'JavaScript' },
        { skillName: 'React' },
        { skillName: 'Node.js' },
        { skillName: 'MongoDB' },
        { skillName: 'CSS' },
      ],
      experience: [
        {
          jobTitle: 'Developer',
          employerName: 'Acme Corp',
          startDate: '2021-01-01',
          isCurrentJob: true,
        },
      ],
      education: [{ institution: 'MIT' }],
    };

    const { score, totalPotentialGain, sum } = sumExceeds100(resumeData);

    
    expect(sum).toBeLessThanOrEqual(100);
  });

  test('BUG REPRO: empty resume also produces a total above what "0 + gain" should allow', () => {
    const { score, totalPotentialGain, sum } = sumExceeds100({});
    
  
    expect(totalPotentialGain).toBeLessThanOrEqual(100 - score);
    expect(sum).toBeLessThanOrEqual(100);
  });

  test('BUG REPRO: resume with only one experience entry', () => {
    const resumeData = {
      experience: [{ jobTitle: 'Intern', employerName: 'Startup' }],
    };
    const { sum } = sumExceeds100(resumeData);
    expect(sum).toBeLessThanOrEqual(100);
  });

  test('calculateAtsScore itself is always clamped between 0 and 100', () => {
    
    const maxedResume = {
      personalInfo: { phone: '01712345678', city: 'Dhaka', country: 'Bangladesh' },
      skills: Array.from({ length: 15 }, (_, i) => ({
        skillName: `Skill ${i}`,
        proficiencyLevel: 'Advanced',
        yearsOfExperience: 5,
      })),
      experience: [
        {
          jobTitle: 'Senior Engineer',
          employerName: 'Acme',
          isCurrentJob: true,
          startDate: '2015-01-01',
        },
        {
          jobTitle: 'Engineer',
          employerName: 'Old Co',
          isCurrentJob: false,
          startDate: '2012-01-01',
          endDate: '2014-01-01',
        },
      ],
      education: [{ institution: 'MIT', degree: 'B.Sc' }],
      projects: [{ title: 'P1' }, { title: 'P2' }, { title: 'P3' }],
      achievements: [{ title: 'A1' }, { title: 'A2' }, { title: 'A3' }],
      references: [{ firstName: 'Jane' }],
      additionalInfos: [{ sectionTitle: 'Certs' }],
    };

    const score = calculateAtsScore(maxedResume);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  test('generateSuggestions never returns a negative or absurd totalPotentialGain', () => {
    const { totalPotentialGain } = generateSuggestions({});
    expect(totalPotentialGain).toBeGreaterThanOrEqual(0);
  });
});