/**
 * TODO-2 / TODO-3: App allows creating/saving a resume without required
 * personal information, and lets users proceed without filling mandatory
 * fields (Due: 20 Aug 2026, medium).
 *
 * Source: backend/middlewares/ResumeDataValidation.js -> validateInformationUpdate
 * fullName / professionalEmail / phone are all `.allow('').optional()`, even
 * though the frontend (PersonalInfo.jsx) marks Name, Email and Phone as
 * required (`<label className="required">`). The server never enforces it.
 *
 * No supertest / HTTP layer: calls the real `verifyToken`,
 * `validateInformationUpdate` middleware and `updateInformation` controller
 * directly via runHandlers (see tests/helpers/callRoute.js).
 */
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';

const jwt = require('jsonwebtoken');
const { runHandlers, makeReq } = require('./helpers/callRoute');
const { verifyToken } = require('../middlewares/TokenVerification');
const { validateInformationUpdate } = require('../middlewares/ResumeDataValidation');

jest.mock('../models/User');
const UserModel = require('../models/User');
const { updateInformation } = require('../controllers/InformationUpdateController');

const CHAIN = [verifyToken, validateInformationUpdate, updateInformation];

describe('TODO-2/3: Personal information required-field enforcement', () => {
  let token;

  beforeEach(() => {
    jest.clearAllMocks();
    token = jwt.sign({ userId: 'user-1' }, process.env.JWT_SECRET);
    UserModel.findByIdAndUpdate.mockResolvedValue({ _id: 'user-1', username: 'x' });
  });

  test('CURRENT (buggy) behavior: empty fullName/email/phone are accepted (200)', async () => {
    const req = makeReq({
      headers: { authorization: `Bearer ${token}` },
      body: {
        defaultResumeData: { personalInfo: { fullName: '', professionalEmail: '', phone: '' } },
      },
    });

    const res = await runHandlers(CHAIN, req);

    expect(res.statusCode).toBe(200); // BUG: mandatory fields were not enforced
  });

  test('EXPECTED (post-fix): saving with blank required personal info should be rejected (400)', async () => {
    const req = makeReq({
      headers: { authorization: `Bearer ${token}` },
      body: {
        defaultResumeData: { personalInfo: { fullName: '', professionalEmail: '', phone: '' } },
      },
    });

    const res = await runHandlers(CHAIN, req);

    // Encodes desired behavior once fullName/professionalEmail/phone become
    // `.required()` (or non-empty) in ResumeDataValidation.js.
    expect(res.statusCode).toBe(400);
  });

  test('a fully completed personal info payload is always accepted', async () => {
    const req = makeReq({
      headers: { authorization: `Bearer ${token}` },
      body: {
        defaultResumeData: {
          personalInfo: {
            fullName: 'Fahima Rahman',
            professionalEmail: 'fahima@gmail.com',
            phone: '+8801700000000',
          },
        },
      },
    });

    const res = await runHandlers(CHAIN, req);
    expect(res.statusCode).toBe(200);
  });

  test('request without a token is rejected (401)', async () => {
    const req = makeReq({
      body: { defaultResumeData: { personalInfo: { fullName: '' } } },
    });

    const res = await runHandlers(CHAIN, req);
    expect(res.statusCode).toBe(401);
  });
});
