
import { calculateAtsScore, generateSuggestions } from '../Components/ATSChecker/ATSLogic';

describe('calculateAtsScore', () => {
  test('an empty resume scores low (not necessarily 0)', () => {
  
    const score = calculateAtsScore({});
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThan(15);
  });

  test('score is always clamped between 0 and 100', () => {
    const stackedResume = {
      personalInfo: { phone: '1234567890', city: 'Dhaka', country: 'Bangladesh' },
      skills: Array.from({ length: 15 }, (_, i) => ({
        skillName: `Skill${i}`,
        proficiencyLevel: 'Advanced',
      })),
      experience: [
        { jobTitle: 'Engineer', isCurrentJob: true, startDate: '2015-01-01' },
        { jobTitle: 'Lead Engineer', startDate: '2020-01-01', endDate: '2022-01-01' },
      ],
      education: [{ degree: 'B.Sc. CSE' }],
      projects: [{ title: 'A' }, { title: 'B' }, { title: 'C' }],
      achievements: [{ title: 'A' }, { title: 'B' }, { title: 'C' }],
      references: [{ firstName: 'X' }],
      additionalInfos: [{ sectionTitle: 'Languages' }],
    };

    const score = calculateAtsScore(stackedResume);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  test('adding 5+ skills increases the score', () => {
    const base = calculateAtsScore({});
    const withSkills = calculateAtsScore({
      skills: Array.from({ length: 5 }, (_, i) => ({ skillName: `Skill${i}` })),
    });
    expect(withSkills).toBeGreaterThan(base);
  });

  test('adding a reachable phone number (>=6 chars) increases the score', () => {
    const base = calculateAtsScore({});
    const withPhone = calculateAtsScore({ personalInfo: { phone: '1234567' } });
    expect(withPhone).toBeGreaterThan(base);
  });

  test('crossing the 6-char phone-length threshold adds exactly 3 points', () => {

    const justUnder = calculateAtsScore({ personalInfo: { phone: '12345' } }); 
    const atThreshold = calculateAtsScore({ personalInfo: { phone: '123456' } }); 
    expect(atThreshold - justUnder).toBe(3);
  });

  test('having at least one experience entry scores higher than none', () => {
    const noExp = calculateAtsScore({});
    const oneExp = calculateAtsScore({ experience: [{ jobTitle: 'Intern' }] });
    expect(oneExp).toBeGreaterThan(noExp);
  });

  test('a second experience entry scores higher than just one', () => {
    const oneExp = calculateAtsScore({ experience: [{ jobTitle: 'Intern' }] });
    const twoExp = calculateAtsScore({
      experience: [{ jobTitle: 'Intern' }, { jobTitle: 'Engineer' }],
    });
    expect(twoExp).toBeGreaterThan(oneExp);
  });
});

describe('generateSuggestions', () => {
  test('suggests adding skills when 3 or fewer are present', () => {
    const { items } = generateSuggestions({ skills: [{ skillName: 'A' }, { skillName: 'B' }] });
    expect(items.some((i) => i.key === 'skills_base')).toBe(true);
  });

  test('does NOT suggest adding skills once 8+ well-rounded skills exist', () => {
    const { items } = generateSuggestions({
      skills: Array.from({ length: 8 }, (_, i) => ({ skillName: `Skill${i}` })),
    });
    expect(items.some((i) => i.key === 'skills_base')).toBe(false);
  });

  test('suggests adding experience when none is present', () => {
    const { items } = generateSuggestions({});
    expect(items.some((i) => i.key === 'exp_none')).toBe(true);
  });

  test('does not suggest adding education once a degree is present', () => {
    const { items } = generateSuggestions({ education: [{ degree: 'B.Sc. CSE' }] });
    expect(items.some((i) => i.key === 'edu_add')).toBe(false);
    expect(items.some((i) => i.key === 'edu_degree')).toBe(false);
  });

  test('suggestions are sorted by potentialGain, highest first', () => {
    const { items } = generateSuggestions({});
    const gains = items.map((i) => i.potentialGain);
    const sortedDesc = [...gains].sort((a, b) => b - a);
    expect(gains).toEqual(sortedDesc);
  });

  test('totalPotentialGain equals the sum of each item\'s potentialGain', () => {
    const { items, totalPotentialGain } = generateSuggestions({});
    const sum = items.reduce((s, i) => s + (i.potentialGain || 0), 0);
    expect(totalPotentialGain).toBe(sum);
  });
});
