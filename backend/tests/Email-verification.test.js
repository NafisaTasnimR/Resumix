
const { runHandlers, makeReq } = require('./helpers/callRoute');
const { validateSignup } = require('../middlewares/AuthValidation');

jest.mock('../models/User');
const UserModel = require('../models/User');
const { signup } = require('../controllers/AuthController');

const CHAIN = [validateSignup, signup];

describe('BUG: signup does not verify the submitted email is a real, reachable account', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    UserModel.findOne.mockResolvedValue(null);
    UserModel.mockImplementation(function (data) {
      const instance = { ...data };
      instance.save = jest.fn().mockResolvedValue(instance);
      return instance;
    });
  });

  test('CURRENT (buggy) behavior: a fake/unreachable but well-formed email is accepted and the account is fully created (201)', async () => {
    const req = makeReq({
      body: {
        username: 'testuser',
        email: 'definitely-fake-88231@no-such-domain-xyz123.test',
        password: 'password123',
      },
    });

    const res = await runHandlers(CHAIN, req);

    expect(res.statusCode).toBe(201); 
    expect(res.body.message).toMatch(/registered successfully/i);
  });

  test('malformed email syntax is still correctly rejected (400)', async () => {
    const req = makeReq({
      body: { username: 'testuser', email: 'not-an-email', password: 'password123' },
    });

    const res = await runHandlers(CHAIN, req);
    expect(res.statusCode).toBe(400);
  });

  test('EXPECTED (post-fix): signup should not fully activate an account on an unverified email alone', async () => {
    const req = makeReq({
      body: {
        username: 'testuser',
        email: 'definitely-fake-88231@no-such-domain-xyz123.test',
        password: 'password123',
      },
    });

    const res = await runHandlers(CHAIN, req);
    expect(res.statusCode).not.toBe(201);
  });
});