const { runHandlers, makeReq } = require('./helpers/callRoute');
const { validateSignup } = require('../middlewares/AuthValidation');

jest.mock('../models/User');
const UserModel = require('../models/User');
const { signup } = require('../controllers/AuthController');

beforeEach(() => {
  jest.clearAllMocks();
  UserModel.findOne.mockResolvedValue(null);
  UserModel.mockImplementation(function (doc) {
    Object.assign(this, doc);
    this.save = jest.fn().mockResolvedValue(this);
  });
});

test('Test Data: email=fahima@gmail.com, password=fahima123 -> well-formed but unverified email is currently accepted', async () => {
  const req = makeReq({
    body: { username: 'fahima', email: 'fahima@gmail.com', password: 'fahima123' },
  });

  const res = await runHandlers([validateSignup, signup], req);

  expect(res.statusCode).toBe(201);
});

test('EXPECTED (post-fix): account should not be usable until the email is verified', async () => {
  const req = makeReq({
    body: { username: 'fahima', email: 'fahima@gmail.com', password: 'fahima123' },
  });

  const res = await runHandlers([validateSignup, signup], req);

  expect(
    res.body?.user?.isEmailVerified === false ||
    /verify|verification/i.test(res.body?.message || '')
  ).toBe(true);
});

test('obviously fake/unreachable domain is accepted the same as a real one (no MX / delivery check)', async () => {
  const req = makeReq({
    body: {
      username: 'nobody',
      email: 'this-domain-does-not-exist-12345@not-a-real-domain-xyz.com',
      password: 'fahima123',
    },
  });

  const res = await runHandlers([validateSignup, signup], req);

  expect(res.statusCode).toBe(201);
});