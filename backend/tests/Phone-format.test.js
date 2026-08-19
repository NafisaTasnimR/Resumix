
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';

const jwt = require('jsonwebtoken');
const { runHandlers, makeReq } = require('./helpers/callRoute');
const { verifyToken } = require('../middlewares/TokenVerification');
const { validateInformationUpdate } = require('../middlewares/ResumeDataValidation');

jest.mock('../models/User');
const UserModel = require('../models/User');
const { updateInformation } = require('../controllers/InformationUpdateController');

const CHAIN = [verifyToken, validateInformationUpdate, updateInformation];

describe('BUG: phone number field accepts any arbitrary string', () => {
  let token;

  beforeEach(() => {
    jest.clearAllMocks();
    token = jwt.sign({ userId: 'user-1' }, process.env.JWT_SECRET);
    UserModel.findByIdAndUpdate.mockResolvedValue({ _id: 'user-1', username: 'x' });
  });

  test.each([
    ['letters only', 'abcxyz'],
    ['single digit', '1'],
    ['symbols mixed in', '!!!abc123###'],
    ['way too long', '9'.repeat(50)],
    ['just whitespace', '   '],
  ])('CURRENT (buggy) behavior: invalid phone "%s" is accepted (200)', async (_label, badPhone) => {
    const req = makeReq({
      headers: { authorization: `Bearer ${token}` },
      body: { defaultResumeData: { personalInfo: { phone: badPhone } } },
    });

    const res = await runHandlers(CHAIN, req);
    expect(res.statusCode).toBe(200);
  });

  test('EXPECTED (post-fix): a clearly invalid phone number should be rejected (400)', async () => {
    const req = makeReq({
      headers: { authorization: `Bearer ${token}` },
      body: { defaultResumeData: { personalInfo: { phone: 'not-a-phone-number!!!' } } },
    });

    const res = await runHandlers(CHAIN, req);
    expect(res.statusCode).toBe(400);
  });

  test('a plausible phone number is always accepted', async () => {
    const req = makeReq({
      headers: { authorization: `Bearer ${token}` },
      body: { defaultResumeData: { personalInfo: { phone: '+8801700000000' } } },
    });

    const res = await runHandlers(CHAIN, req);
    expect(res.statusCode).toBe(200);
  });

  test('request without a token is rejected (401)', async () => {
    const req = makeReq({ body: { defaultResumeData: { personalInfo: { phone: 'abc' } } } });
    const res = await runHandlers(CHAIN, req);
    expect(res.statusCode).toBe(401);
  });
});