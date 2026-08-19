
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';

const jwt = require('jsonwebtoken');
const { runHandlers, makeReq } = require('./helpers/callRoute');
const { verifyToken } = require('../middlewares/TokenVerification');
const { validateInformationUpdate } = require('../middlewares/ResumeDataValidation');

jest.mock('../models/User');
const UserModel = require('../models/User');
const { updateInformation } = require('../controllers/InformationUpdateController');

const CHAIN = [verifyToken, validateInformationUpdate, updateInformation];

describe('BUG: achievements accepted without credential/proof verification', () => {
  let token;

  beforeEach(() => {
    jest.clearAllMocks();
    token = jwt.sign({ userId: 'user-1' }, process.env.JWT_SECRET);
    UserModel.findByIdAndUpdate.mockResolvedValue({ _id: 'user-1', username: 'x' });
  });

  test('CURRENT (buggy) behavior: an achievement with a title but no proof (empty website) is accepted (200)', async () => {
    const req = makeReq({
      headers: { authorization: `Bearer ${token}` },
      body: {
        defaultResumeData: {
          achievements: [
            { title: 'World Champion of Everything', organization: 'Made-Up Org', website: '' },
          ],
        },
      },
    });

    const res = await runHandlers(CHAIN, req);
    expect(res.statusCode).toBe(200); 
  });

  test('CURRENT (buggy) behavior: a completely empty achievement object is accepted (200)', async () => {
    const req = makeReq({
      headers: { authorization: `Bearer ${token}` },
      body: { defaultResumeData: { achievements: [{}] } },
    });

    const res = await runHandlers(CHAIN, req);
    expect(res.statusCode).toBe(200);
  });

  test('EXPECTED (post-fix): an achievement without a verifiable credential/proof link should be rejected (400)', async () => {
    const req = makeReq({
      headers: { authorization: `Bearer ${token}` },
      body: {
        defaultResumeData: {
          achievements: [{ title: 'Certified Something', organization: 'Some Org', website: '' }],
        },
      },
    });

    const res = await runHandlers(CHAIN, req);


    expect(res.statusCode).toBe(400);
  });

  test('request without a token is rejected (401)', async () => {
    const req = makeReq({ body: { defaultResumeData: { achievements: [{ title: 'x' }] } } });
    const res = await runHandlers(CHAIN, req);
    expect(res.statusCode).toBe(401);
  });
});